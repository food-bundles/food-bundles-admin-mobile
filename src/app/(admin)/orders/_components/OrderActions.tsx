import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { useOrdersStore } from '@/stores/ordersStore';
import { Button } from '@/components/ui/Button';
import { ActionMenu } from '@/components/modals/ActionMenu';
import type { Order, OrderStatus } from '@/mocks/orders';
import { ORDER_STEPS, STATUS_KEY, isTerminalNonHappy, stepIndex } from './orderSteps';

export interface OrderActionsProps {
  order: Order;
  restaurantPhone: string;
  onAdvanceStatus: (next: OrderStatus) => void;
}

const CAN_UPDATE_STATUS_ROLES = ['SUPERUSER', 'ADMIN'];
const NON_TERMINAL_FOR_PAYMENT: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'READY', 'IN_TRANSIT', 'DELIVERED'];

/**
 * Status-advance menu (ADMIN+, non-terminal only), contact-restaurant, and (Section 8) Request
 * payment / Reorder. EBM download and a dedicated "support modal" are not built — neither exists
 * anywhere in the real order-modals.tsx source, so there's nothing to adapt; "contact restaurant"
 * opens the OS dialer with the restaurant's real phone number instead.
 */
export function OrderActions({ order, restaurantPhone, onAdvanceStatus }: OrderActionsProps) {
  const t = useT();
  const { colors } = useTheme();
  const role = useAuthStore((state) => state.user?.role);
  const createOrder = useOrdersStore((state) => state.createOrder);
  const requestPayment = useOrdersStore((state) => state.requestPayment);
  const paymentRequestSent = useOrdersStore((state) => state.paymentRequestSent[order.id] ?? false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isTerminal = isTerminalNonHappy(order.status) || order.status === 'DELIVERED';
  const canUpdate = role ? CAN_UPDATE_STATUS_ROLES.includes(role) : false;
  const nextSteps = ORDER_STEPS.slice(stepIndex(order.status) + 1);
  const canRequestPayment = NON_TERMINAL_FOR_PAYMENT.includes(order.status) && !paymentRequestSent;

  const handleReorder = () => {
    const newOrder = createOrder({
      restaurantId: order.restaurantId,
      restaurantName: order.restaurantName,
      items: order.items,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
    });
    router.push(`/(admin)/orders/${newOrder.id}`);
  };

  return (
    <View style={styles.container}>
      {canUpdate && !isTerminal ? (
        <Button variant="primary" fullWidth onPress={() => setMenuOpen(true)}>
          {t('orders.updateStatus')}
        </Button>
      ) : null}

      {canRequestPayment ? (
        <Button variant="secondary" fullWidth onPress={() => requestPayment(order.id)}>
          {t('orderBehalf.requestPayment')}
        </Button>
      ) : null}
      {paymentRequestSent ? (
        <Text style={[styles.confirmText, { color: colors.ripe }]}>
          {t('orderBehalf.paymentRequested', { restaurant: order.restaurantName })}
        </Text>
      ) : null}

      {order.status !== 'CANCELLED' ? (
        <Button variant="ghost" fullWidth onPress={handleReorder}>
          {t('orderBehalf.reorder')}
        </Button>
      ) : null}

      <Button variant="ghost" fullWidth onPress={() => Linking.openURL(`tel:${restaurantPhone}`)}>
        {t('orders.contactRestaurant')}
      </Button>

      <ActionMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={nextSteps.map((step) => ({
          label: t(STATUS_KEY[step]),
          onPress: () => onAdvanceStatus(step),
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg, gap: space.sm, marginTop: space.md },
  confirmText: { ...text.caption },
});
