import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Button } from '@/components/ui/Button';
import { useOrdersStore } from '@/stores/ordersStore';
import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';
import type { OrderItem, PaymentMethod } from '@/mocks/orders';
import { SelectRestaurantStep } from './_components/SelectRestaurantStep';
import { SelectItemsStep } from './_components/SelectItemsStep';
import { DeliveryStep } from './_components/DeliveryStep';
import { PaymentStep } from './_components/PaymentStep';
import { ConfirmStep } from './_components/ConfirmStep';

type Step = 1 | 2 | 3 | 4 | 5;
const STEP_KEYS = [
  'orderBehalf.stepSelectRestaurant',
  'orderBehalf.stepAddItems',
  'orderBehalf.stepDelivery',
  'orderBehalf.stepPayment',
  'orderBehalf.stepConfirm',
] as const;

/**
 * Multi-step "create order on behalf of a restaurant" flow (ADMIN+). When opened with a
 * `restaurantId` query param (from the restaurant detail's Orders tab FAB) it pre-selects that
 * restaurant and jumps straight to Step 2.
 */
export default function CreateOrderOnBehalfScreen() {
  useRoleGuard('orders');
  const t = useT();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ restaurantId?: string }>();
  const preselected = useMemo(() => MOCK_RESTAURANTS.find((r) => r.id === params.restaurantId) ?? null, [params.restaurantId]);
  const createOrder = useOrdersStore((state) => state.createOrder);

  const [step, setStep] = useState<Step>(preselected ? 2 : 1);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(preselected);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState(preselected?.address ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [phone, setPhone] = useState('');
  const [voucherId, setVoucherId] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const canAdvance =
    (step === 1 && restaurant !== null) ||
    (step === 2 && items.length > 0) ||
    step === 3 ||
    step === 4;

  const handleNext = () => {
    if (step === 1 && restaurant) setAddress(restaurant.address);
    if (step < 5) setStep((step + 1) as Step);
  };

  const handleConfirm = () => {
    if (!restaurant) return;
    const order = createOrder({ restaurantId: restaurant.id, restaurantName: restaurant.name, items, deliveryAddress: address, paymentMethod });
    setCreatedOrderId(order.id);
    router.replace(`/(admin)/orders/${order.id}`);
  };

  return (
    <AdminScreen title={t('orderBehalf.title')} showBack>
      <View style={styles.stepHeader}>
        <Text style={[styles.stepLabel, { color: colors.leaf }]}>{t(STEP_KEYS[step - 1])}</Text>
        <Text style={[styles.stepCount, { color: colors.muted }]}>{step}/5</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 ? <SelectRestaurantStep value={restaurant} onSelect={setRestaurant} /> : null}
        {step === 2 ? <SelectItemsStep items={items} onChange={setItems} /> : null}
        {step === 3 ? <DeliveryStep address={address} onChange={setAddress} /> : null}
        {step === 4 && restaurant ? (
          <PaymentStep
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            value={paymentMethod}
            onChange={setPaymentMethod}
            phone={phone}
            onChangePhone={setPhone}
            voucherId={voucherId}
            onChangeVoucherId={setVoucherId}
          />
        ) : null}
        {step === 5 && restaurant ? (
          <ConfirmStep restaurantName={restaurant.name} items={items} deliveryAddress={address} paymentMethod={paymentMethod} />
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        {step > 1 ? (
          <View style={styles.footerButton}>
            <Button variant="secondary" fullWidth onPress={() => setStep((step - 1) as Step)}>
              {t('orderBehalf.back')}
            </Button>
          </View>
        ) : null}
        <View style={styles.footerButton}>
          {step < 5 ? (
            <Button variant="primary" fullWidth disabled={!canAdvance} onPress={handleNext}>
              {t('orderBehalf.next')}
            </Button>
          ) : (
            <Button variant="primary" fullWidth onPress={handleConfirm}>
              {t('orderBehalf.confirmCreate')}
            </Button>
          )}
        </View>
      </View>
      {createdOrderId ? (
        <Text style={[styles.success, { color: colors.ripe }]}>
          {t('orderBehalf.orderCreated', { id: createdOrderId, restaurant: restaurant?.name ?? '' })}
        </Text>
      ) : null}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: space.sm },
  stepLabel: { ...text.bodySemi },
  stepCount: { ...text.caption },
  content: { padding: space.lg, gap: space.md },
  footer: { flexDirection: 'row', gap: space.sm, padding: space.lg },
  footerButton: { flex: 1 },
  success: { ...text.bodySemi, paddingHorizontal: space.lg, paddingBottom: space.md },
});
