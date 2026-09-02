import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { generateCannedReply, simulateDelivery, simulateRead, simulateTyping } from '@/lib/chatSimulator';
import { MOCK_CONVERSATIONS, MOCK_CHAT_HISTORY, ADMIN_PARTICIPANT_ID, type ChatMessage, type Conversation } from '@/mocks/chat';
import type { ComposerAttachment } from '@/components/chat/ChatComposer';

const REPLY_DELAY_MS = 400;

interface ConversationsState {
  conversations: Conversation[];
  history: Record<string, ChatMessage[]>;
  typingConversationId: string | null;
  send: (conversationId: string, body: string, attachment: ComposerAttachment | null) => void;
  markRead: (conversationId: string) => void;
}

function restaurantSenderId(conversation: Conversation): string {
  return conversation.participantIds.find((id) => id !== ADMIN_PARTICIPANT_ID) ?? conversation.participantIds[0];
}

/** Session-mutable per-restaurant conversation list + message history, seeded from MOCK_CONVERSATIONS/MOCK_CHAT_HISTORY. */
export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  history: MOCK_CHAT_HISTORY,
  typingConversationId: null,

  markRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    })),

  send: (conversationId, body, attachment) => {
    const now = new Date().toISOString();
    const message: ChatMessage = attachment
      ? {
          id: generateId('peermsg'),
          senderId: ADMIN_PARTICIPANT_ID,
          kind: attachment.kind,
          body,
          attachment: attachment.uri,
          durationMs: attachment.durationMs,
          sentAt: now,
        }
      : { id: generateId('peermsg'), senderId: ADMIN_PARTICIPANT_ID, kind: 'text', body, sentAt: now };

    set((state) => ({
      history: { ...state.history, [conversationId]: [...(state.history[conversationId] ?? []), message] },
      conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, lastMessage: message } : c)),
    }));

    void simulateDelivery(() => {
      set((state) => ({
        history: {
          ...state.history,
          [conversationId]: state.history[conversationId]?.map((m) => (m.id === message.id ? { ...m, deliveredAt: new Date().toISOString() } : m)) ?? [],
        },
      }));
    });

    void simulateRead(() => {
      set((state) => ({
        history: {
          ...state.history,
          [conversationId]: state.history[conversationId]?.map((m) => (m.id === message.id ? { ...m, readAt: new Date().toISOString() } : m)) ?? [],
        },
      }));
    });

    void (async () => {
      const conversation = get().conversations.find((c) => c.id === conversationId);
      if (!conversation) return;
      await simulateTyping(
        () => set({ typingConversationId: conversationId }),
        () => set({ typingConversationId: null }),
      );
      await new Promise((resolve) => setTimeout(resolve, REPLY_DELAY_MS));
      const replyBody = generateCannedReply(get().history[conversationId]?.length ?? 0);
      const reply: ChatMessage = {
        id: generateId('peermsg'),
        senderId: restaurantSenderId(conversation),
        kind: 'text',
        body: replyBody,
        sentAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
      };
      set((state) => ({
        history: { ...state.history, [conversationId]: [...(state.history[conversationId] ?? []), reply] },
        conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, lastMessage: reply } : c)),
      }));
    })();
  },
}));
