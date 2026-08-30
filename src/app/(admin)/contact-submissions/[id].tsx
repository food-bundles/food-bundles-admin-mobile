import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOCK_CONTACT_SUBMISSIONS, type ContactStatus } from '@/mocks/contact-submissions';

/** Full message + reply form. Mock: sending a reply updates status to REPLIED locally. */
export default function ContactSubmissionDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const baseSubmission = useMemo(() => MOCK_CONTACT_SUBMISSIONS.find((c) => c.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<ContactStatus | null>(null);
  const [replyOverride, setReplyOverride] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const submission =
    baseSubmission && (statusOverride || replyOverride)
      ? { ...baseSubmission, status: statusOverride ?? baseSubmission.status, reply: replyOverride ?? baseSubmission.reply }
      : baseSubmission;

  if (!submission) {
    return (
      <AdminScreen title={t('contactSubmissions.title')}>
        <EmptyState icon={null} title={t('contactSubmissions.emptyTitle')} message={t('contactSubmissions.emptyMessage')} />
      </AdminScreen>
    );
  }

  const handleSend = () => {
    if (!reply.trim()) return;
    setReplyOverride(reply.trim());
    setStatusOverride('REPLIED');
  };

  return (
    <AdminScreen title={submission.name} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.name, { color: colors.ink }]}>{submission.name}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{submission.email}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
          <Text style={[styles.message, { color: colors.body }]}>{submission.message}</Text>
        </Card>

        {submission.reply ? (
          <Card>
            <Text style={[styles.replyLabel, { color: colors.muted }]}>{t('contactSubmissions.repliedLabel')}</Text>
            <Text style={[styles.message, { color: colors.body }]}>{submission.reply}</Text>
          </Card>
        ) : (
          <View style={styles.replyForm}>
            <Input label={t('contactSubmissions.replyPlaceholder')} value={reply} onChangeText={setReply} />
            <Button variant="primary" fullWidth onPress={handleSend}>
              {t('contactSubmissions.sendReply')}
            </Button>
          </View>
        )}
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  name: { ...text.h2 },
  detail: { ...text.caption, marginTop: space.xs },
  message: { ...text.body, marginTop: space.md },
  replyLabel: { ...text.label },
  replyForm: { gap: space.md },
});
