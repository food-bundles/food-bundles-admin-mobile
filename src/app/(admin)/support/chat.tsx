import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatComposer, type ComposerAttachment } from '@/components/chat/ChatComposer';
import { useOpsAssistantStore, VIEWER_ID } from '@/stores/opsAssistantStore';
import type { ChatMessage } from '@/mocks/chat';
import { OpsAssistantHeader } from './_components/OpsAssistantHeader';
import { SuggestedQuestions } from './_components/SuggestedQuestions';

/**
 * AI ops-assistant chat: the bottom nav's centre avatar button's real destination. Fully mocked —
 * canned keyword-matched answers about loans, stock, orders, and markets, with a simulated typing
 * delay. Voice-note and document/photo attachment supported via the shared ChatComposer.
 */
export default function AiSupportChatScreen() {
  useRoleGuard('dashboard');
  const t = useT();
  const messages = useOpsAssistantStore((state) => state.messages);
  const isTyping = useOpsAssistantStore((state) => state.isTyping);
  const send = useOpsAssistantStore((state) => state.send);

  const handleSend = (draft: string, attachment: ComposerAttachment | null) => {
    send(draft, attachment);
  };

  const inverted = [...messages].reverse();

  return (
    <AdminScreen title={t('tab.aiSupport')} showBack>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <OpsAssistantHeader />
        <FlatList
          data={inverted}
          inverted
          keyExtractor={(item: ChatMessage) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} isOwn={item.senderId === VIEWER_ID} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={isTyping ? <View style={styles.typingWrap}><TypingIndicator /></View> : null}
        />
        <SuggestedQuestions onSelect={(label) => send(label, null)} />
        <ChatComposer onSend={handleSend} />
      </KeyboardAvoidingView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingHorizontal: space.lg, paddingVertical: space.md, flexGrow: 1, justifyContent: 'flex-end' },
  typingWrap: { marginBottom: space.sm },
});
