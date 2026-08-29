import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { font, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Voucher, VoucherStatus } from '@/mocks/vouchers';

const STATUS_TONE: Record<VoucherStatus, 'ripe' | 'neutral' | 'chili'> = {
  AVAILABLE: 'ripe',
  USED: 'neutral',
  EXPIRED: 'chili',
};

const STATUS_KEY: Record<VoucherStatus, TranslationKey> = {
  AVAILABLE: 'vouchers.statusAvailable',
  USED: 'vouchers.statusUsed',
  EXPIRED: 'vouchers.statusExpired',
};

export interface VoucherRowProps {
  voucher: Voucher;
}

/** Code (monospace) + restaurant + amount + status chip + expiry + linked order (if USED). */
export function VoucherRow({ voucher }: VoucherRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={() => router.push(`/(admin)/vouchers/${voucher.id}`)} accessibilityLabel={`${voucher.code}, ${voucher.restaurantName}`}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.code, { color: colors.leaf }]}>{voucher.code}</Text>
          <Text style={[styles.name, { color: colors.ink }]}>{voucher.restaurantName}</Text>
        </View>
        <Badge tone={STATUS_TONE[voucher.status]} label={t(STATUS_KEY[voucher.status])} />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(voucher.amount)}</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(voucher.expiresAt, language)}</Text>
      </View>
      {voucher.status === 'USED' && voucher.orderId ? (
        <Text style={[styles.orderLink, { color: colors.leaf }]}>{t('vouchers.linkedOrder')}: {voucher.orderId}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1, gap: 2 },
  code: { ...text.bodySemi, fontFamily: font.monospace },
  name: { ...text.caption },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  amount: { ...text.bodySemi, fontFamily: font.displayBold },
  detail: { ...text.caption },
  orderLink: { ...text.caption, marginTop: space.xs },
});
