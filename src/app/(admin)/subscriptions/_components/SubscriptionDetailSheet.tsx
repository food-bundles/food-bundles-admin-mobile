import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_ORDERS } from '@/mocks/orders';
import { MOCK_PLANS, type RestaurantSubscription } from '@/mocks/subscriptions';
import { useSubscriptionsStore } from '@/stores/subscriptionsStore';

export interface SubscriptionDetailSheetProps {
  subscription: RestaurantSubscription | null;
  onClose: () => void;
}

/** Detail sheet: billing history (last 3 mock payments), next billing date, usage stats, "View restaurant", Cancel. */
export function SubscriptionDetailSheet({ subscription, onClose }: SubscriptionDetailSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const cancelSubscription = useSubscriptionsStore((state) => state.cancelSubscription);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const plan = subscription ? MOCK_PLANS.find((p) => p.id === subscription.planId) : undefined;
  const orderCount = subscription ? MOCK_ORDERS.filter((o) => o.restaurantId === subscription.restaurantId).length : 0;
  const billingHistory = subscription
    ? [0, 1, 2].map((i) => {
        const date = new Date(subscription.startDate);
        date.setMonth(date.getMonth() + i);
        return { date: date.toISOString(), amount: subscription.amount };
      })
    : [];

  return (
    <Sheet visible={subscription !== null} height="tall" onClose={onClose}>
      {subscription ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.ink }]}>{subscription.restaurantName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{plan?.name} · {subscription.billingCycle}</Text>
          <Text style={[styles.detail, { color: colors.body }]}>
            {t('subscriptions.nextBilling')}: {formatDate(subscription.nextBillingDate, language)}
          </Text>
          <Text style={[styles.detail, { color: colors.body }]}>
            {t('subscriptions.usageStats')}: {t('subscriptions.orderCountThisPeriod', { count: orderCount })}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('subscriptions.billingHistory')}</Text>
          {billingHistory.map((entry) => (
            <View key={entry.date} style={styles.historyRow}>
              <Text style={[styles.historyDate, { color: colors.body }]}>{formatDate(entry.date, language)}</Text>
              <Text style={[styles.historyAmount, { color: colors.ink }]}>{formatRwf(entry.amount)}</Text>
            </View>
          ))}

          <Button
            variant="ghost"
            fullWidth
            onPress={() => {
              onClose();
              router.push(`/(admin)/users/restaurants/${subscription.restaurantId}`);
            }}
          >
            {t('subscriptions.viewRestaurant')}
          </Button>

          {subscription.status !== 'CANCELLED' ? (
            <Button variant="destructive" fullWidth onPress={() => setConfirmOpen(true)}>
              {t('subscriptions.cancelSubscription')}
            </Button>
          ) : null}

          <ConfirmDialog
            visible={confirmOpen}
            title={t('subscriptions.cancelSubscription')}
            message={t('subscriptions.cancelConfirm', { restaurant: subscription.restaurantName })}
            confirmLabel={t('common.confirm')}
            variant="danger"
            onConfirm={() => {
              cancelSubscription(subscription.id);
              setConfirmOpen(false);
              onClose();
            }}
            onCancel={() => setConfirmOpen(false)}
          />
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2 },
  detail: { ...text.body, marginTop: space.xs },
  sectionTitle: { ...text.h3, marginTop: space.md, marginBottom: space.sm },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.xs },
  historyDate: { ...text.body },
  historyAmount: { ...text.bodySemi },
});
