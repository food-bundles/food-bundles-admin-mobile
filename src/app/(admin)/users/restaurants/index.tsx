import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { usePaginatedList } from '@/lib/usePaginatedList';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { PaginationBar } from '@/components/data/PaginationBar';
import { Input } from '@/components/ui/Input';
import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';
import { RestaurantStats } from './_components/RestaurantStats';
import { RestaurantRow } from './_components/RestaurantRow';

type FilterKey = 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'SUBSCRIBED';

function matchesFilter(restaurant: Restaurant, filter: FilterKey): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'SUBSCRIBED') return restaurant.subscription !== null;
  return restaurant.status === filter;
}

/** Restaurant list: 4 StatCards, filters, search, pagination. Built from users/restaurants/page.tsx. */
export default function RestaurantsScreen() {
  useRoleGuard('usersRestaurants');
  const { colors } = useTheme();
  const t = useT();
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_RESTAURANTS.filter((r) => {
      const bySearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.tin.includes(q) ||
        r.phone.includes(q);
      return bySearch && matchesFilter(r, filter);
    });
  }, [search, filter]);

  const fetchPage = useCallback(
    async (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    },
    [filtered],
  );

  const list = usePaginatedList<Restaurant>({ pageSize: 10, fetchPage });

  const chips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    { key: 'ACTIVE', label: t('restaurants.active') },
    { key: 'SUSPENDED', label: t('restaurants.suspended') },
    { key: 'PENDING_VERIFICATION', label: t('restaurants.pendingVerification') },
    { key: 'SUBSCRIBED', label: t('restaurants.filterSubscribed') },
  ];

  return (
    <AdminScreen title={t('restaurants.title')}>
      <View style={styles.statsWrap}>
        <RestaurantStats />
      </View>
      <View style={styles.searchWrap}>
        <Input label={t('common.search')} value={search} onChangeText={setSearch} placeholder={t('restaurants.searchPlaceholder')} />
      </View>
      <View style={styles.filterWrap}>
        <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as FilterKey)} />
      </View>
      <DataList
        data={list.items}
        renderItem={({ item }) => <RestaurantRow restaurant={item} />}
        keyExtractor={(item) => item.id}
        isLoading={list.isLoading}
        isEmpty={!list.isLoading && list.items.length === 0}
        emptyTitle={t('restaurants.emptyTitle')}
        emptyMessage={t('restaurants.emptyMessage')}
        emptyIcon={<Ionicons name="storefront-outline" size={20} color={colors.leaf} />}
        errorMessage={list.errorMessage}
        onRetry={list.retry}
        onRefresh={list.refresh}
        refreshing={list.isRefreshing}
      />
      <PaginationBar page={list.page} totalPages={list.totalPages} onPrev={() => list.setPage(list.page - 1)} onNext={() => list.setPage(list.page + 1)} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  statsWrap: { paddingTop: space.md },
  searchWrap: { paddingHorizontal: space.lg, paddingTop: space.lg },
  filterWrap: { paddingVertical: space.md },
});
