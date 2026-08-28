import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PLANS, MOCK_SUBSCRIPTIONS, type SubscriptionStatus } from '@/mocks/subscriptions';

type FilterKey = 'ALL' | 'plan-basic' | 'plan-premium' | 'EXPIRED' | 'CANCELLED';

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
  const [filter, setFilter] = useState<FilterKey>('ALL');

  const now = Date.now();
  const filtered = MOCK_SUBSCRIPTIONS.filter((s) => {
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
      <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as FilterKey)} />
      <DataList
        data={filtered}
        renderItem={({ item }) => {
          const plan = MOCK_PLANS.find((p) => p.id === item.planId);
          return (
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
          );
        }}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={filtered.length === 0}
        emptyTitle={t('subscriptions.emptyTitle')}
        emptyMessage={t('subscriptions.emptyMessage')}
        emptyIcon={<Ionicons name="repeat-outline" size={20} color={colors.leaf} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
});
