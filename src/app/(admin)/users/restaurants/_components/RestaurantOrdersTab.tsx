import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { EmptyState } from '@/components/ui/EmptyState';
import { useOrdersStore } from '@/stores/ordersStore';
import { OrderRow } from '../../../orders/_components/OrderRow';

export interface RestaurantOrdersTabProps {
  restaurantId: string;
}

/**
 * Filtered order list for this restaurant, reusing the Orders screen's row component, plus a
 * "New order for this restaurant" button that jumps to Step 2 of the create-on-behalf wizard with
 * this restaurant pre-selected. Rendered inline rather than as a true floating overlay — this tab
 * renders inside the restaurant detail screen's own ScrollView, where `position: absolute` would
 * anchor to the scrolling content rather than the viewport.
 */
export function RestaurantOrdersTab({ restaurantId }: RestaurantOrdersTabProps) {
  const t = useT();
  const { colors } = useTheme();
  const allOrders = useOrdersStore((state) => state.orders);
  const orders = allOrders.filter((o) => o.restaurantId === restaurantId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push(`/(admin)/orders/create-behalf?restaurantId=${restaurantId}` as never)}
        accessibilityRole="button"
        accessibilityLabel={t('orderBehalf.newOrderForRestaurant')}
        style={[styles.fab, shadow.elevated, { backgroundColor: colors.leaf }]}
      >
        <Ionicons name="add" size={20} color={colors.paper} />
        <Text style={[styles.fabLabel, { color: colors.paper }]}>{t('orderBehalf.newOrderForRestaurant')}</Text>
      </Pressable>
      {orders.length === 0 ? (
        <EmptyState icon={null} title={t('orders.emptyTitle')} message={t('orders.emptyMessage')} />
      ) : (
        orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            expanded={expandedId === order.id}
            onToggle={() => setExpandedId((prev) => (prev === order.id ? null : order.id))}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  fab: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    borderRadius: radius.pill,
  },
  fabLabel: { ...text.bodySemi },
});
