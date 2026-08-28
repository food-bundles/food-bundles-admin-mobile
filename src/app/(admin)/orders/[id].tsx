import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_ORDERS, type OrderStatus } from '@/mocks/orders';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { OrderStatusRail } from './_components/OrderStatusRail';
import { OrderRestaurantCard } from './_components/OrderRestaurantCard';
import { OrderItemsList } from './_components/OrderItemsList';
import { OrderSummarySections } from './_components/OrderSummarySections';
import { OrderActions } from './_components/OrderActions';

/** Order detail: header, status rail, restaurant card, items, totals, payment, address, actions. */
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  const baseOrder = useMemo(() => MOCK_ORDERS.find((o) => o.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<OrderStatus | null>(null);
  const order = baseOrder && statusOverride ? { ...baseOrder, status: statusOverride } : baseOrder;
  const restaurant = order ? MOCK_RESTAURANTS.find((r) => r.id === order.restaurantId) : undefined;

  if (!order || !restaurant) {
    return (
      <AdminScreen title={t('orders.title')}>
        <EmptyState
          icon={null}
          title={t('orders.emptyTitle')}
          message={t('orders.emptyMessage')}
        />
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={t('orders.detailTitle', { id: order.id })}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.orderId, { color: colors.leaf }]}>{order.id}</Text>
          <StatusChip status={order.status} />
          <Text style={[styles.date, { color: colors.muted }]}>{formatDate(order.createdAt, language)}</Text>
        </View>
        <OrderStatusRail status={order.status} />
        <OrderRestaurantCard restaurant={restaurant} />
        <OrderItemsList items={order.items} />
        <OrderSummarySections order={order} />
        <OrderActions order={order} restaurantPhone={restaurant.phone} onAdvanceStatus={setStatusOverride} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xxxl, gap: space.lg },
  header: { paddingHorizontal: space.lg, gap: space.xs },
  orderId: { ...text.h1 },
  date: { ...text.caption },
});
