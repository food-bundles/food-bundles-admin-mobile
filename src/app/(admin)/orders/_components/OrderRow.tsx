import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatRelative } from '@/lib/date';
import { StatusChip } from '@/components/ui/StatusChip';
import { ExpandRow } from '@/components/data/ExpandRow';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import type { Order } from '@/mocks/orders';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { PaymentMethodIcon } from './PaymentMethodIcon';
import { OrderProgressTrack } from './OrderProgressTrack';

export interface OrderRowProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Tappable order row: id, restaurant + district, status chip, total, payment icon, relative date,
 * progress track. Expands (accordion, one row at a time) to show items ordered, delivery address,
 * and payment method — a "View full order" link still pushes to the full detail screen.
 */
export function OrderRow({ order, expanded, onToggle }: OrderRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const district = MOCK_RESTAURANTS.find((r) => r.id === order.restaurantId)?.district;

  return (
    <ExpandRow
      expanded={expanded}
      onToggle={onToggle}
      accessibilityLabel={`${t('orders.detailTitle', { id: order.id })}, ${order.restaurantName}`}
      header={
        <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
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
        </View>
      }
    >
      <View style={styles.panelContent}>
        {order.items.map((item) => (
          <View key={item.productId} style={styles.itemRow}>
            <Image source={{ uri: item.imageUri }} style={styles.itemPhoto} />
            <Text style={[styles.itemName, { color: colors.ink }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.itemQty, { color: colors.muted }]}>
              {item.qty} × {formatRwf(item.unitPrice)}
            </Text>
          </View>
        ))}
        <Text style={[styles.detailLine, { color: colors.body }]}>{order.deliveryAddress}</Text>
        <Text style={[styles.detailLine, { color: colors.body }]}>{t(PAYMENT_METHOD_KEY[order.paymentMethod])}</Text>
        <Pressable
          onPress={() => router.push(`/(admin)/orders/${order.id}`)}
          accessibilityRole="button"
          accessibilityLabel={t('orders.viewFullOrder')}
        >
          <Text style={[styles.viewLink, { color: colors.leaf }]}>{t('orders.viewFullOrder')}</Text>
        </Pressable>
      </View>
    </ExpandRow>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.lg, gap: space.xs },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { ...text.h3 },
  restaurant: { ...text.body },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  date: { ...text.caption },
  total: { ...text.bodySemi },
  panelContent: { paddingHorizontal: space.lg, gap: space.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  itemPhoto: { width: 40, height: 40, borderRadius: radius.sm },
  itemName: { ...text.body, flex: 1 },
  itemQty: { ...text.caption },
  detailLine: { ...text.body },
  viewLink: { ...text.bodySemi, marginTop: space.xs },
});
