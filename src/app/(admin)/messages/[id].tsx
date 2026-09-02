import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatComposer, type ComposerAttachment } from '@/components/chat/ChatComposer';
import { CallScreen } from '@/components/chat/CallScreen';
import { useConversationsStore } from '@/stores/conversationsStore';
import { ADMIN_PARTICIPANT_ID, type CallKind, type ChatMessage } from '@/mocks/chat';
import { ConversationHeader } from './_components/ConversationHeader';

/** Thread view for one restaurant conversation: header with call buttons, inverted message list, typing indicator, composer. */
export default function ConversationDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const conversations = useConversationsStore((state) => state.conversations);
  const history = useConversationsStore((state) => state.history);
  const typingConversationId = useConversationsStore((state) => state.typingConversationId);
  const send = useConversationsStore((state) => state.send);
  const markRead = useConversationsStore((state) => state.markRead);
  const [activeCall, setActiveCall] = useState<CallKind | null>(null);

  const conversation = conversations.find((c) => c.id === id);

  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) markRead(conversation.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  if (!conversation) {
    return (
      <AdminScreen title={t('messages.title')}>
        <EmptyState icon={null} title={t('messages.emptyTitle')} message={t('messages.emptyMessage')} />
      </AdminScreen>
    );
  }

  const messages = history[conversation.id] ?? [];
  const inverted = [...messages].reverse();
  const isTyping = typingConversationId === conversation.id;

  const handleSend = (draft: string, attachment: ComposerAttachment | null) => {
    send(conversation.id, draft, attachment);
  };

  return (
    <AdminScreen title={conversation.restaurantName} showBack>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ConversationHeader
          restaurantName={conversation.restaurantName}
          restaurantImageUri={conversation.restaurantImageUri}
          onAudioCall={() => setActiveCall('audio')}
          onVideoCall={() => setActiveCall('video')}
        />
        <FlatList
          data={inverted}
          inverted
          keyExtractor={(item: ChatMessage) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} isOwn={item.senderId === ADMIN_PARTICIPANT_ID} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={isTyping ? <View style={styles.typingWrap}><TypingIndicator /></View> : null}
        />
        <ChatComposer onSend={handleSend} />
      </KeyboardAvoidingView>

      <CallScreen
        visible={activeCall !== null}
        kind={activeCall ?? 'audio'}
        peerName={conversation.restaurantName}
        onEnd={() => setActiveCall(null)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingHorizontal: space.lg, paddingVertical: space.md, flexGrow: 1, justifyContent: 'flex-end' },
  typingWrap: { marginBottom: space.sm },
});
