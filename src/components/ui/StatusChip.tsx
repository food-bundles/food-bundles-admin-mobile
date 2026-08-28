import { StyleSheet, Text, View } from 'react-native';
import { ORDER_STATUS_TOKEN, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export type OrderStatus = keyof typeof ORDER_STATUS_TOKEN;

const STATUS_KEY = {
  PENDING: 'status.pending',
  CONFIRMED: 'status.confirmed',
  PREPARING: 'status.preparing',
  READY: 'status.ready',
  IN_TRANSIT: 'status.inTransit',
  DELIVERED: 'status.delivered',
  CANCELLED: 'status.cancelled',
  REFUNDED: 'status.refunded',
} as const;

export interface StatusChipProps {
  status: OrderStatus;
}

/** Order-status pill, coloured per the exact ORDER_STATUS_TOKEN mapping. */
export function StatusChip({ status }: StatusChipProps) {
  const { colors } = useTheme();
  const t = useT();
  const token = ORDER_STATUS_TOKEN[status];

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
