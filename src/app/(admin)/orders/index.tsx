import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { usePaginatedList } from '@/lib/usePaginatedList';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { PaginationBar } from '@/components/data/PaginationBar';
import { Input } from '@/components/ui/Input';
import { ActionMenu } from '@/components/modals/ActionMenu';
import { MOCK_ORDERS, type Order, type OrderStatus } from '@/mocks/orders';
import { OrderRow } from './_components/OrderRow';
import { STATUS_KEY } from './_components/orderSteps';

const STATUS_FILTERS: (OrderStatus | 'ALL')[] = [
  'ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];

type SortKey = 'newest' | 'oldest' | 'totalAsc' | 'totalDesc';

function sortOrders(orders: Order[], sort: SortKey): Order[] {
  const sorted = [...orders];
  if (sort === 'newest') return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (sort === 'oldest') return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  if (sort === 'totalAsc') return sorted.sort((a, b) => a.total - b.total);
  return sorted.sort((a, b) => b.total - a.total);
}

/** Order list: status filter chips, search, sort menu, pagination. Built from restaurant-orders/page.tsx. */
export default function OrdersScreen() {
  useRoleGuard('orders');
  const { colors } = useTheme();
  const t = useT();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bySearch = MOCK_ORDERS.filter(
      (o) => !q || o.id.toLowerCase().includes(q) || o.restaurantName.toLowerCase().includes(q),
    );
    const byStatus = statusFilter === 'ALL' ? bySearch : bySearch.filter((o) => o.status === statusFilter);
    return sortOrders(byStatus, sort);
  }, [search, statusFilter, sort]);

  const fetchPage = useCallback(
    async (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    },
    [filtered],
  );

  const list = usePaginatedList<Order>({ pageSize: 10, fetchPage });

  const chips: FilterChip[] = STATUS_FILTERS.map((s) => ({
    key: s,
    label: s === 'ALL' ? t('orders.filterAll') : t(STATUS_KEY[s]),
  }));

  const sortLabel: Record<SortKey, string> = {
    newest: t('orders.sortNewest'),
    oldest: t('orders.sortOldest'),
    totalAsc: t('orders.sortTotalAsc'),
    totalDesc: t('orders.sortTotalDesc'),
  };

  return (
    <AdminScreen title={t('orders.title')}>
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Input label={t('common.search')} value={search} onChangeText={setSearch} placeholder={t('orders.searchPlaceholder')} />
        </View>
        <Pressable
          onPress={() => setSortMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={sortLabel[sort]}
          style={styles.sortButton}
        >
          <Ionicons name="swap-vertical" size={20} color={colors.ink} />
        </Pressable>
      </View>
      <View style={styles.filterWrap}>
        <FilterBar chips={chips} activeKey={statusFilter} onSelect={(key) => setStatusFilter(key as OrderStatus | 'ALL')} />
      </View>
      <DataList
        data={list.items}
        renderItem={({ item }) => (
          <OrderRow
            order={item}
            expanded={expandedId === item.id}
            onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
          />
        )}
        keyExtractor={(item) => item.id}
        isLoading={list.isLoading}
        isEmpty={!list.isLoading && list.items.length === 0}
        emptyTitle={t('orders.emptyTitle')}
        emptyMessage={t('orders.emptyMessage')}
        emptyIcon={<Ionicons name="receipt-outline" size={20} color={colors.leaf} />}
        errorMessage={list.errorMessage}
        onRetry={list.retry}
        onRefresh={list.refresh}
        refreshing={list.isRefreshing}
      />
      <PaginationBar page={list.page} totalPages={list.totalPages} onPrev={() => list.setPage(list.page - 1)} onNext={() => list.setPage(list.page + 1)} />
      <ActionMenu
        visible={sortMenuOpen}
        onClose={() => setSortMenuOpen(false)}
        items={(Object.keys(sortLabel) as SortKey[]).map((key) => ({
          label: sortLabel[key],
          onPress: () => setSort(key),
        }))}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.lg, paddingTop: space.md },
  searchInput: { flex: 1 },
  sortButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  filterWrap: { paddingVertical: space.md },
});
