import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { simulateTyping, sleep } from '@/lib/chatSimulator';
import { translate } from '@/i18n';
import { pickOpsReplyKey } from '@/lib/opsAssistantReplies';
import type { ComposerAttachment } from '@/components/chat/ChatComposer';
import type { ChatMessage } from '@/mocks/chat';

const ASSISTANT_ID = 'ops-assistant';
export const VIEWER_ID = 'me';
const REPLY_DELAY_MS = 500;

function textMessage(senderId: string, body: string): ChatMessage {
  const now = new Date().toISOString();
  return { id: generateId('opsmsg'), senderId, kind: 'text', body, sentAt: now, deliveredAt: now, readAt: now };
}

interface OpsAssistantState {
  messages: ChatMessage[];
  isTyping: boolean;
  send: (body: string, attachment: ComposerAttachment | null) => void;
}

/** Session-only AI ops-assistant thread: canned keyword-matched replies with a simulated typing delay. */
export const useOpsAssistantStore = create<OpsAssistantState>((set) => ({
  messages: [textMessage(ASSISTANT_ID, translate('opsAssistant.greeting'))],
  isTyping: false,
  send: (body, attachment) => {
    const now = new Date().toISOString();
    const userMessage: ChatMessage = attachment
      ? {
          id: generateId('opsmsg'),
          senderId: VIEWER_ID,
          kind: attachment.kind,
          body,
          attachment: attachment.uri,
          durationMs: attachment.durationMs,
          sentAt: now,
          deliveredAt: now,
        }
      : textMessage(VIEWER_ID, body);

    set((state) => ({ messages: [...state.messages, userMessage] }));

    void (async () => {
      await simulateTyping(
        () => set({ isTyping: true }),
        () => set({ isTyping: false }),
      );
      await sleep(REPLY_DELAY_MS);
      const replyKey = pickOpsReplyKey(body || attachment?.label || '');
      set((state) => ({ messages: [...state.messages, textMessage(ASSISTANT_ID, translate(replyKey))] }));
    })();
  },
}));
