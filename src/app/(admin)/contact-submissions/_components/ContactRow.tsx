import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { text, useTheme } from '@/theme';
import { useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ContactSubmission } from '@/mocks/contact-submissions';

export interface ContactRowProps {
  submission: ContactSubmission;
}

/** Name + email + date + status chip. Unread rows get a marigold left border. */
export function ContactRow({ submission }: ContactRowProps) {
  const { colors } = useTheme();
  const language = useLanguageStore((state) => state.language);
  const isUnread = submission.status === 'UNREAD';

  return (
    <Card
      onPress={() => router.push(`/(admin)/contact-submissions/${submission.id}`)}
      accessibilityLabel={submission.name}
      style={isUnread ? { borderLeftWidth: 3, borderLeftColor: colors.marigold } : undefined}
    >
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{submission.name}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{submission.email}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
        </View>
        <Badge tone={isUnread ? 'marigold' : submission.status === 'REPLIED' ? 'leaf' : 'neutral'} label={submission.status} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
