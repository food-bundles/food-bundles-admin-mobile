import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatRelative } from '@/lib/date';
import { StatusChip } from '@/components/ui/StatusChip';
import type { Order } from '@/mocks/orders';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import { OrderProgressTrack } from './OrderProgressTrack';

export interface OrderRowProps {
  order: Order;
}

/** Tappable order row: id, restaurant + district, status chip, total, payment icon, relative date, progress track. */
export function OrderRow({ order }: OrderRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const district = MOCK_RESTAURANTS.find((r) => r.id === order.restaurantId)?.district;

  return (
    <Pressable
      onPress={() => router.push(`/(admin)/orders/${order.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${t('orders.detailTitle', { id: order.id })}, ${order.restaurantName}`}
      style={[styles.row, { borderBottomColor: colors.hairline }]}
    >
      <View style={styles.header}>
        <Text style={[styles.orderId, { color: colors.leaf }]}>{order.id}</Text>
        <StatusChip status={order.status} />
      </View>
      <Text style={[styles.restaurant, { color: colors.ink }]}>
        {order.restaurantName}
        {district ? ` · ${district}` : ''}
      </Text>
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <PaymentMethodIcon method={order.paymentMethod} />
          <Text style={[styles.date, { color: colors.muted }]}>{formatRelative(order.createdAt, language, t)}</Text>
        </View>
        <Text style={[styles.total, { color: colors.ink }]}>{formatRwf(order.total)}</Text>
      </View>
      <OrderProgressTrack status={order.status} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.md, paddingHorizontal: space.lg, borderBottomWidth: 1, gap: space.xs },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { ...text.h3 },
  restaurant: { ...text.body },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  date: { ...text.caption },
  total: { ...text.bodySemi },
});
