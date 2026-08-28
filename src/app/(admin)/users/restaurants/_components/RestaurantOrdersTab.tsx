import { View } from 'react-native';
import { useT } from '@/i18n';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_ORDERS } from '@/mocks/orders';
import { OrderRow } from '../../../orders/_components/OrderRow';

export interface RestaurantOrdersTabProps {
  restaurantId: string;
}

/** Filtered order list for this restaurant, reusing the Orders screen's row component. */
export function RestaurantOrdersTab({ restaurantId }: RestaurantOrdersTabProps) {
  const t = useT();
  const orders = MOCK_ORDERS.filter((o) => o.restaurantId === restaurantId);

  if (orders.length === 0) {
    return <EmptyState icon={null} title={t('orders.emptyTitle')} message={t('orders.emptyMessage')} />;
  }

  return (
    <View>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </View>
  );
}
