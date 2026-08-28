import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { FarmerSubmission, SubmissionStatus } from '@/mocks/farmer-submissions';

const STATUS_TONE: Record<SubmissionStatus, 'marigold' | 'leaf' | 'chili'> = {
  PENDING: 'marigold',
  APPROVED: 'leaf',
  REJECTED: 'chili',
  VERIFIED: 'leaf',
};

const STATUS_KEY: Record<SubmissionStatus, TranslationKey> = {
  PENDING: 'farmerSubmissions.statusPending',
  APPROVED: 'farmerSubmissions.statusApproved',
  REJECTED: 'farmerSubmissions.statusRejected',
  VERIFIED: 'farmerSubmissions.statusVerified',
};

export interface SubmissionRowProps {
  submission: FarmerSubmission;
}

/** Farmer name + product name + quantity + unit price + submitted date + status. */
export function SubmissionRow({ submission }: SubmissionRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={() => router.push(`/(admin)/farmer-submissions/${submission.id}`)} accessibilityLabel={submission.farmerName}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{submission.farmerName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {submission.productName} · {submission.quantity} {submission.unit}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
        </View>
        <View style={styles.trailing}>
          <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(submission.pricePerUnit)}</Text>
          <Badge tone={STATUS_TONE[submission.status]} label={t(STATUS_KEY[submission.status])} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
  price: { ...text.bodySemi },
});
