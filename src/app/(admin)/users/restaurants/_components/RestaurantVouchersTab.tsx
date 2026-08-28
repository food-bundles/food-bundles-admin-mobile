import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_VOUCHERS } from '@/mocks/vouchers';
import { MOCK_LOAN_APPLICATIONS } from '@/mocks/loans';

export interface RestaurantVouchersTabProps {
  restaurantId: string;
}

/** Active vouchers + loan applications for this restaurant. */
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
        <Card key={voucher.id} onPress={() => router.push(`/(admin)/vouchers/${voucher.id}`)} accessibilityLabel={voucher.voucherType}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.ink }]}>{voucher.voucherType.replace('_', ' ')}</Text>
            <Badge tone={voucher.status === 'ACTIVE' ? 'leaf' : 'neutral'} label={voucher.status} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {formatRwf(voucher.outstandingBalance)} / {formatRwf(voucher.creditLimit)}
          </Text>
        </Card>
      ))}
      {loanApplications.map((application) => (
        <Card key={application.id} onPress={() => router.push('/(admin)/vouchers')} accessibilityLabel={application.status}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.ink }]}>{formatRwf(application.requestedAmount)}</Text>
            <Badge tone={application.status === 'PENDING' ? 'marigold' : application.status === 'REJECTED' ? 'chili' : 'leaf'} label={application.status} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]} numberOfLines={1}>
            {application.purpose}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
