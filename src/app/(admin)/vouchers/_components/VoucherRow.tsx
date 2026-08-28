import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useLanguageStore } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Voucher } from '@/mocks/vouchers';

const STATUS_TONE = { ACTIVE: 'leaf', EXHAUSTED: 'neutral', EXPIRED: 'chili', DEACTIVATED: 'chili' } as const;

export interface VoucherRowProps {
  voucher: Voucher;
}

/** Real model: voucherType + restaurant + credit limit/outstanding + status + expiry — no PAN, no session state. */
export function VoucherRow({ voucher }: VoucherRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={() => router.push(`/(admin)/vouchers/${voucher.id}`)} accessibilityLabel={voucher.restaurantName}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{voucher.restaurantName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{voucher.voucherType.replace('_', ' ')}</Text>
        </View>
        <Badge tone={STATUS_TONE[voucher.status]} label={voucher.status} />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.detail, { color: colors.muted }]}>
          {t('vouchers.outstandingBalance')}: {formatRwf(voucher.outstandingBalance)} / {formatRwf(voucher.creditLimit)}
        </Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(voucher.expiryDate, language)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
});
