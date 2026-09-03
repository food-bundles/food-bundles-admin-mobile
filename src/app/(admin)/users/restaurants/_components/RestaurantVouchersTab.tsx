import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { font, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VoucherStatusChip } from '@/components/ui/VoucherStatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_VOUCHERS } from '@/mocks/vouchers';
import { MOCK_LOAN_APPLICATIONS, type LoanApplicationStatus } from '@/mocks/loanApplications';

const LOAN_STATUS_TONE: Record<LoanApplicationStatus, 'marigold' | 'neutral' | 'leaf' | 'chili'> = {
  PENDING: 'marigold',
  UNDER_REVIEW: 'neutral',
  APPROVED: 'leaf',
  REJECTED: 'chili',
};
const LOAN_STATUS_KEY: Record<LoanApplicationStatus, TranslationKey> = {
  PENDING: 'vouchers.statusPending',
  UNDER_REVIEW: 'vouchers.statusUnderReview',
  APPROVED: 'vouchers.statusApproved',
  REJECTED: 'vouchers.statusRejected',
};

export interface RestaurantVouchersTabProps {
  restaurantId: string;
}

/** Active vouchers (single-use tokens) + loan applications for this restaurant. */
export function RestaurantVouchersTab({ restaurantId }: RestaurantVouchersTabProps) {
  const { colors } = useTheme();
  const t = useT();
  const vouchers = MOCK_VOUCHERS.filter((v) => v.restaurantId === restaurantId);
  const loanApplications = MOCK_LOAN_APPLICATIONS.filter((l) => l.restaurantId === restaurantId);

  if (vouchers.length === 0 && loanApplications.length === 0) {
    return <EmptyState icon={null} title={t('restaurants.noVouchers')} message={t('restaurants.noVouchers')} />;
  }

  return (
    <View style={styles.container}>
      {vouchers.map((voucher) => (
        <Card key={voucher.id} onPress={() => router.push(`/(admin)/vouchers/${voucher.id}`)} accessibilityLabel={voucher.code}>
          <View style={styles.row}>
            <Text style={[styles.code, { color: colors.ink }]}>{voucher.code}</Text>
            <VoucherStatusChip status={voucher.status} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatRwf(voucher.amount)}</Text>
        </Card>
      ))}
      {loanApplications.map((application) => (
        <Card key={application.id} onPress={() => router.push('/(admin)/vouchers')} accessibilityLabel={t(LOAN_STATUS_KEY[application.status])}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.ink }]}>{formatRwf(application.requestedAmount)}</Text>
            <Badge tone={LOAN_STATUS_TONE[application.status]} label={t(LOAN_STATUS_KEY[application.status])} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]} numberOfLines={1}>
            {application.questionnaire.purpose}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  code: { ...text.bodySemi, fontFamily: font.monospace },
  label: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
