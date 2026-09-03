import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useSubscriptionsStore } from '@/stores/subscriptionsStore';
import { MOCK_PLANS, type BillingCycle } from '@/mocks/subscriptions';
import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';

export interface CreateSubscriptionSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CYCLES: BillingCycle[] = ['WEEKLY', 'MONTHLY'];

/** ADMIN+ sheet: select restaurant/plan/billing cycle/start date, mock-creates the subscription. */
export function CreateSubscriptionSheet({ visible, onClose }: CreateSubscriptionSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const createSubscription = useSubscriptionsStore((state) => state.createSubscription);
  const [search, setSearch] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [planId, setPlanId] = useState(MOCK_PLANS[0]?.id ?? '');
  const [cycle, setCycle] = useState<BillingCycle>('MONTHLY');
  const [created, setCreated] = useState(false);

  const matches = MOCK_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));

  const handleCreate = () => {
    if (!restaurant) return;
    createSubscription({ restaurantId: restaurant.id, restaurantName: restaurant.name, planId, billingCycle: cycle, startDate: new Date().toISOString() });
    setCreated(true);
  };

  const handleClose = () => {
    setCreated(false);
    setRestaurant(null);
    setSearch('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="tall" onClose={handleClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('subscriptions.createTitle')}</Text>

        {created ? (
          <Text style={[styles.success, { color: colors.ripe }]}>{t('subscriptions.createSuccess', { restaurant: restaurant?.name ?? '' })}</Text>
        ) : (
          <>
            <Input label={t('orderBehalf.searchRestaurant')} value={search} onChangeText={setSearch} />
            {matches.slice(0, 5).map((r) => (
              <Pressable
                key={r.id}
                onPress={() => setRestaurant(r)}
                accessibilityRole="button"
                accessibilityLabel={r.name}
                accessibilityState={{ selected: restaurant?.id === r.id }}
                style={[styles.optionRow, { borderColor: restaurant?.id === r.id ? colors.leaf : colors.hairline }]}
              >
                <Text style={[styles.optionLabel, { color: colors.ink }]}>{r.name}</Text>
              </Pressable>
            ))}

            <Text style={[styles.label, { color: colors.ink }]}>{t('subscriptions.selectPlan')}</Text>
            <View style={styles.chipRow}>
              {MOCK_PLANS.map((plan) => (
                <Pressable
                  key={plan.id}
                  onPress={() => setPlanId(plan.id)}
                  accessibilityRole="button"
                  accessibilityLabel={plan.name}
                  accessibilityState={{ selected: planId === plan.id }}
                  style={[styles.chip, { borderColor: colors.hairline }, planId === plan.id && { backgroundColor: colors.leaf, borderColor: colors.leaf }]}
                >
                  <Text style={[styles.chipLabel, { color: planId === plan.id ? colors.paper : colors.body }]}>{plan.name}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.ink }]}>{t('subscriptions.billingCycle')}</Text>
            <View style={styles.chipRow}>
              {CYCLES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCycle(c)}
                  accessibilityRole="button"
                  accessibilityLabel={c}
                  accessibilityState={{ selected: cycle === c }}
                  style={[styles.chip, { borderColor: colors.hairline }, cycle === c && { backgroundColor: colors.leaf, borderColor: colors.leaf }]}
                >
                  <Text style={[styles.chipLabel, { color: cycle === c ? colors.paper : colors.body }]}>{c}</Text>
                </Pressable>
              ))}
            </View>

            <Button variant="primary" fullWidth disabled={!restaurant} onPress={handleCreate}>
              {t('subscriptions.createTitle')}
            </Button>
          </>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2, marginBottom: space.md },
  success: { ...text.bodySemi },
  optionRow: { padding: space.sm, borderWidth: 1.5, borderRadius: radius.md, marginBottom: space.xs },
  optionLabel: { ...text.body },
  label: { ...text.label, marginTop: space.md, marginBottom: space.xs },
  chipRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap', marginBottom: space.sm },
  chip: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1 },
  chipLabel: { ...text.bodySemi },
});
