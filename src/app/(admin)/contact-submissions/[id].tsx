import { useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatComposer, type ComposerAttachment } from '@/components/chat/ChatComposer';
import { useContactSubmissionsStore } from '@/stores/contactSubmissionsStore';
import type { ConversationMessage, ContactStatus } from '@/mocks/contact-submissions';
import type { ChatMessage } from '@/mocks/chat';

const STATUS_TONE = { UNREAD: 'marigold', READ: 'neutral', REPLIED: 'leaf' } as const;
const STATUS_KEY: Record<ContactStatus, TranslationKey> = {
  UNREAD: 'contactSubmissions.statusUnread',
  READ: 'contactSubmissions.statusRead',
  REPLIED: 'contactSubmissions.statusReplied',
};

/** Maps the contact-submissions domain message shape onto the shared ChatMessage shape MessageBubble renders. */
function toChatMessage(message: ConversationMessage): ChatMessage {
  if (message.voiceUri) {
    return { id: message.id, senderId: message.from, kind: 'voice', body: '', attachment: message.voiceUri, durationMs: message.voiceDurationMs, sentAt: message.timestamp, deliveredAt: message.timestamp, readAt: message.timestamp };
  }
  if (message.attachmentName) {
    return {
      id: message.id,
      senderId: message.from,
      kind: message.attachmentIsImage ? 'image' : 'file',
      body: message.text,
      attachment: message.attachmentName,
      sentAt: message.timestamp,
      deliveredAt: message.timestamp,
      readAt: message.timestamp,
    };
  }
  return { id: message.id, senderId: message.from, kind: 'text', body: message.text, sentAt: message.timestamp, deliveredAt: message.timestamp, readAt: message.timestamp };
}

/** Full chat thread: header (name/email/status/back), inverted message list, attachment- and voice-note-capable composer, "Mark as resolved". */
export default function ContactSubmissionDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const submissions = useContactSubmissionsStore((state) => state.submissions);
  const sendMessage = useContactSubmissionsStore((state) => state.sendMessage);
  const setStatus = useContactSubmissionsStore((state) => state.setStatus);
  const submission = useMemo(() => submissions.find((s) => s.id === id), [submissions, id]);

  if (!submission) {
    return (
      <AdminScreen title={t('contactSubmissions.title')}>
        <EmptyState icon={null} title={t('contactSubmissions.emptyTitle')} message={t('contactSubmissions.emptyMessage')} />
      </AdminScreen>
    );
  }

  const inverted = [...submission.messages].reverse();

  const handleSend = (draft: string, attachment: ComposerAttachment | null) => {
    sendMessage({
      submissionId: submission.id,
      text: draft || (attachment?.kind === 'image' ? t('contactSubmissions.photoAttached') : (attachment?.label ?? '')),
      attachmentName: attachment?.kind !== 'voice' ? attachment?.uri : undefined,
      attachmentIsImage: attachment?.kind === 'image',
      voiceUri: attachment?.kind === 'voice' ? attachment.uri : undefined,
      voiceDurationMs: attachment?.kind === 'voice' ? attachment.durationMs : undefined,
    });
  };

  return (
    <AdminScreen title={submission.name} showBack>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderColor: colors.hairline }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.email, { color: colors.muted }]}>{submission.email}</Text>
            <Badge tone={STATUS_TONE[submission.status]} label={t(STATUS_KEY[submission.status])} />
          </View>
          {submission.status !== 'REPLIED' ? (
            <Button variant="secondary" size="sm" onPress={() => setStatus(submission.id, 'REPLIED')}>
              {t('contactSubmissions.markResolved')}
            </Button>
          ) : null}
        </View>
        <FlatList
          data={inverted}
          inverted
          keyExtractor={(item: ConversationMessage) => item.id}
          renderItem={({ item }) => <MessageBubble message={toChatMessage(item)} isOwn={item.from === 'admin'} />}
          contentContainerStyle={styles.list}
        />
        <ChatComposer onSend={handleSend} />
      </KeyboardAvoidingView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: space.sm, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  email: { ...text.caption },
  list: { paddingHorizontal: space.lg, paddingVertical: space.md, flexGrow: 1, justifyContent: 'flex-end' },
});
