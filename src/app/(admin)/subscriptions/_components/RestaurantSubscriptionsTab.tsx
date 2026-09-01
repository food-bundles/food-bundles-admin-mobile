import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useSubscriptionsStore } from '@/stores/subscriptionsStore';
import { MOCK_PLANS, type RestaurantSubscription, type SubscriptionStatus } from '@/mocks/subscriptions';
import { CreateSubscriptionSheet } from './CreateSubscriptionSheet';
import { SubscriptionDetailSheet } from './SubscriptionDetailSheet';

type FilterKey = 'ALL' | 'plan-basic' | 'plan-premium' | 'EXPIRED' | 'CANCELLED';
const CAN_CREATE_ROLES = ['SUPERUSER', 'ADMIN'];

const STATUS_TONE: Record<SubscriptionStatus, 'leaf' | 'marigold' | 'chili'> = {
  ACTIVE: 'leaf',
  PAST_DUE: 'marigold',
  CANCELLED: 'chili',
};

/** List: restaurant + plan badge + billing cycle + status + next billing date. Filters: All | Basic | Premium | Expired | Cancelled. */
export function RestaurantSubscriptionsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const role = useAuthStore((state) => state.user?.role);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<RestaurantSubscription | null>(null);
  const canCreate = role ? CAN_CREATE_ROLES.includes(role) : false;

  const now = Date.now();
  const filtered = subscriptions.filter((s) => {
    if (filter === 'ALL') return true;
    if (filter === 'EXPIRED') return s.status !== 'CANCELLED' && new Date(s.nextBillingDate).getTime() < now;
    if (filter === 'CANCELLED') return s.status === 'CANCELLED';
    return s.planId === filter;
  });

  const chips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    { key: 'plan-basic', label: MOCK_PLANS[0]?.name ?? 'Basic' },
    { key: 'plan-premium', label: MOCK_PLANS[1]?.name ?? 'Premium' },
    { key: 'EXPIRED', label: t('subscriptions.filterExpired') },
    { key: 'CANCELLED', label: t('subscriptions.filterCancelled') },
  ];

  return (
    <View style={styles.container}>
      {canCreate ? (
        <View style={styles.createRow}>
          <Button variant="primary" size="sm" onPress={() => setCreateOpen(true)}>
            {t('subscriptions.createTitle')}
          </Button>
        </View>
      ) : null}
      <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as FilterKey)} />
      <DataList
        data={filtered}
        renderItem={({ item }) => {
          const plan = MOCK_PLANS.find((p) => p.id === item.planId);
          return (
            <Pressable onPress={() => setDetailTarget(item)} accessibilityRole="button" accessibilityLabel={item.restaurantName}>
              <Card accessibilityLabel={item.restaurantName}>
                <View style={styles.row}>
                  <View style={styles.textCol}>
                    <Text style={[styles.name, { color: colors.ink }]}>{item.restaurantName}</Text>
                    <Text style={[styles.detail, { color: colors.muted }]}>
                      {item.billingCycle} · {t('subscriptions.nextBilling')}: {formatDate(item.nextBillingDate, language)}
                    </Text>
                  </View>
                  <View style={styles.trailing}>
                    {plan ? <Badge tone="leaf" label={plan.name} /> : null}
                    <Badge tone={STATUS_TONE[item.status]} label={item.status} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={filtered.length === 0}
        emptyTitle={t('subscriptions.emptyTitle')}
        emptyMessage={t('subscriptions.emptyMessage')}
        emptyIcon={<Ionicons name="repeat-outline" size={20} color={colors.leaf} />}
      />
      <CreateSubscriptionSheet visible={createOpen} onClose={() => setCreateOpen(false)} />
      <SubscriptionDetailSheet subscription={detailTarget} onClose={() => setDetailTarget(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  createRow: { paddingVertical: space.sm, alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
});
