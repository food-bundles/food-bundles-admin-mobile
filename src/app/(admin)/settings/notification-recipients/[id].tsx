import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/modals/Sheet';
import { MOCK_NOTIFICATION_RECIPIENTS } from '@/mocks/notification-recipients';
import { useRecipientMessagesStore, historyFor } from '@/stores/recipientMessagesStore';
import { SendTestSheet } from './_components/SendTestSheet';
import { RecipientForm } from './_components/RecipientForm';

/**
 * Recipient detail: profile (name/email/channels/active), "Message history" (last notifications
 * sent to this recipient, sent-message bubbles leaf-bg right-aligned with timestamp + channel
 * badge — outbound-only, no reply input), "Send test notification". The edit form is still
 * reachable — see notification-recipients/create.tsx and the existing RecipientForm.
 */
export default function NotificationRecipientDetailScreen() {
  useRoleGuard('settings');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const recipient = useMemo(() => MOCK_NOTIFICATION_RECIPIENTS.find((r) => r.id === id), [id]);
  const sentByRecipient = useRecipientMessagesStore((state) => state.sentByRecipient);
  const sendTestMessage = useRecipientMessagesStore((state) => state.sendTestMessage);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!recipient) {
    return (
      <AdminScreen title={t('settings.notificationRecipients')}>
        <EmptyState icon={null} title={t('settings.emptyRecipientsTitle')} message={t('settings.emptyRecipientsMessage')} />
      </AdminScreen>
    );
  }

  const history = historyFor(recipient.channels, sentByRecipient[recipient.id] ?? []);

  return (
    <AdminScreen title={recipient.name} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.name, { color: colors.ink }]}>{recipient.name}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{recipient.email}</Text>
          <View style={styles.chipRow}>
            {recipient.channels.map((channel) => (
              <Badge key={channel} tone="leaf" label={channel} />
            ))}
            <Badge tone={recipient.active ? 'ripe' : 'neutral'} label={t(recipient.active ? 'common.confirm' : 'common.cancel')} />
          </View>
          <Button variant="ghost" fullWidth onPress={() => setEditOpen(true)}>
            {t('settings.editRecipient')}
          </Button>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('settings.messageHistory')}</Text>
        {history.length === 0 ? (
          <Text style={[styles.detail, { color: colors.muted }]}>{t('settings.noMessagesSent')}</Text>
        ) : (
          history.map((message) => (
            <View key={message.id} style={styles.bubbleRow}>
              <View style={[styles.bubble, { backgroundColor: colors.leaf }]}>
                <Text style={[styles.bubbleTitle, { color: colors.paper }]}>{message.title}</Text>
                <Text style={[styles.bubbleBody, { color: colors.paper }]}>{message.body}</Text>
                <View style={styles.bubbleFooter}>
                  <View style={[styles.channelBadge, { backgroundColor: colors.pine }]}>
                    <Text style={[styles.channelBadgeLabel, { color: colors.paper }]}>{message.channel}</Text>
                  </View>
                  <Text style={[styles.bubbleTime, { color: colors.paper }]}>{formatDate(message.timestamp, language)}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <Button variant="primary" fullWidth onPress={() => setSheetOpen(true)}>
          {t('settings.sendTestNotification')}
        </Button>
      </ScrollView>

      <SendTestSheet
        visible={sheetOpen}
        defaultChannel={recipient.channels[0] ?? 'system'}
        onClose={() => setSheetOpen(false)}
        onSend={(body) => sendTestMessage(recipient.id, recipient.channels[0] ?? 'system', body)}
      />

      <Sheet visible={editOpen} height="tall" onClose={() => setEditOpen(false)}>
        <RecipientForm initial={recipient} onSubmit={() => setEditOpen(false)} submitLabel={t('common.save')} />
      </Sheet>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  name: { ...text.h2 },
  detail: { ...text.caption, marginTop: space.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, marginVertical: space.sm },
  sectionTitle: { ...text.h3 },
  bubbleRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '85%', borderRadius: radius.md, padding: space.md, gap: 4, marginBottom: space.sm },
  bubbleTitle: { ...text.bodySemi },
  bubbleBody: { ...text.body },
  bubbleFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xs },
  channelBadge: { borderRadius: radius.pill, paddingHorizontal: space.xs, paddingVertical: 2 },
  channelBadgeLabel: { fontSize: 10, fontWeight: '600' },
  bubbleTime: { fontSize: 10, opacity: 0.8 },
});
