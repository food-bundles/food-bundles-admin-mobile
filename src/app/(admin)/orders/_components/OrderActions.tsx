import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
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

/**
 * Status-advance menu (ADMIN+, non-terminal only) and contact-restaurant.
 * EBM download and a dedicated "support modal" are not built — neither
 * exists anywhere in the real order-modals.tsx source, so there's nothing
 * to adapt; "contact restaurant" opens the OS dialer with the restaurant's
 * real phone number instead, since that's an action this screen can
 * actually perform honestly with the data it already has.
 */
export function OrderActions({ order, restaurantPhone, onAdvanceStatus }: OrderActionsProps) {
  const t = useT();
  const role = useAuthStore((state) => state.user?.role);
  const [menuOpen, setMenuOpen] = useState(false);

  const isTerminal = isTerminalNonHappy(order.status) || order.status === 'DELIVERED';
  const canUpdate = role ? CAN_UPDATE_STATUS_ROLES.includes(role) : false;
  const nextSteps = ORDER_STEPS.slice(stepIndex(order.status) + 1);

  return (
    <View style={styles.container}>
      {canUpdate && !isTerminal ? (
        <Button variant="primary" fullWidth onPress={() => setMenuOpen(true)}>
          {t('orders.updateStatus')}
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
});
