import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_PLANS, MOCK_SUBSCRIPTIONS, type SubscriptionPlan } from '@/mocks/subscriptions';
import { EditPlanSheet } from './EditPlanSheet';

/** Basic + Premium cards: monthly/weekly price, active subscriber count, "Edit plan" (SUPERUSER only). */
export function PlansTab() {
  const { colors } = useTheme();
  const t = useT();
  const role = useAuthStore((state) => state.user?.role);
  const canEdit = role === 'SUPERUSER';
  const [overrides, setOverrides] = useState<Record<string, { monthlyPrice: number; weeklyPrice: number }>>({});
  const [editTarget, setEditTarget] = useState<SubscriptionPlan | null>(null);

  const plans = MOCK_PLANS.map((plan) => (overrides[plan.id] ? { ...plan, ...overrides[plan.id] } : plan));

  return (
    <View style={styles.container}>
      {plans.map((plan) => {
        const activeCount = MOCK_SUBSCRIPTIONS.filter((s) => s.planId === plan.id && s.status === 'ACTIVE').length;
        return (
          <Card key={plan.id} accessibilityLabel={plan.name}>
            <Text style={[styles.name, { color: colors.ink }]}>{plan.name}</Text>
            <Text style={[styles.price, { color: colors.ink }]}>
              {formatRwf(plan.monthlyPrice)} / {t('subscriptions.monthly').toLowerCase()}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
              {formatRwf(plan.weeklyPrice)} / {t('subscriptions.weekly').toLowerCase()}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
              {t('subscriptions.activeSubscribers')}: {activeCount}
            </Text>
            {canEdit ? (
              <View style={styles.editWrap}>
                <Button variant="secondary" size="sm" onPress={() => setEditTarget(plan)}>
                  {t('subscriptions.editPlan')}
                </Button>
              </View>
            ) : null}
          </Card>
        );
      })}
      <EditPlanSheet
        plan={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(monthlyPrice, weeklyPrice) => {
          if (editTarget) setOverrides((prev) => ({ ...prev, [editTarget.id]: { monthlyPrice, weeklyPrice } }));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  name: { ...text.h2 },
  price: { ...text.priceLg, marginTop: space.sm },
  detail: { ...text.caption, marginTop: space.xs },
  editWrap: { marginTop: space.md },
});
