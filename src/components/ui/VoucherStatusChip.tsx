import { StyleSheet, Text, View } from 'react-native';
import { VOUCHER_STATUS_TOKEN, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import type { VoucherStatus } from '@/mocks/vouchers';

const STATUS_KEY: Record<VoucherStatus, TranslationKey> = {
  AVAILABLE: 'vouchers.statusAvailable',
  USED: 'vouchers.statusUsed',
  EXPIRED: 'vouchers.statusExpired',
};

export interface VoucherStatusChipProps {
  status: VoucherStatus;
}

/**
 * Single-use voucher token status pill, coloured per the exact
 * VOUCHER_STATUS_TOKEN mapping (ripe / pine-disabled / chili-outline) —
 * distinct from the generic Badge and from order StatusChip, since a
 * voucher's 3-state model isn't either of those palettes.
 */
export function VoucherStatusChip({ status }: VoucherStatusChipProps) {
  const { colors } = useTheme();
  const t = useT();
  const token = VOUCHER_STATUS_TOKEN[status];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors[token.bg] },
        'borderColor' in token && { borderWidth: 1, borderColor: colors[token.borderColor] },
      ]}
    >
      <Text style={[styles.label, { color: colors[token.text] }]}>{t(STATUS_KEY[status])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
    alignSelf: 'flex-start',
  },
  label: { ...text.overline },
});
