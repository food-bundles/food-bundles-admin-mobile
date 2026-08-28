import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { hit, space, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { usePaginatedList } from '@/lib/usePaginatedList';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { ActionMenu } from '@/components/modals/ActionMenu';
import { Button } from '@/components/ui/Button';
import { MOCK_PRODUCTS, type Product, type ProductStatus } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { ProductRow } from './_components/ProductRow';

type SortKey = 'nameAsc' | 'priceAsc' | 'priceDesc' | 'stockAsc' | 'stockDesc';

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  if (sort === 'nameAsc') return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'priceAsc') return sorted.sort((a, b) => a.price - b.price);
  if (sort === 'priceDesc') return sorted.sort((a, b) => b.price - a.price);
  if (sort === 'stockAsc') return sorted.sort((a, b) => a.stock - b.stock);
  return sorted.sort((a, b) => b.stock - a.stock);
}

const STATUS_KEY: Record<ProductStatus, TranslationKey> = {
  ACTIVE: 'products.statusActive',
  OUT_OF_STOCK: 'products.statusOutOfStock',
  DISCONTINUED: 'products.statusDiscontinued',
};

/** Product list: category + status filters, sort menu, pagination. Built from stock/products/page.tsx. */
export default function ProductsScreen() {
  useRoleGuard('stock');
  const { colors } = useTheme();
  const t = useT();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortKey>('nameAsc');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const byCategory = categoryFilter === 'ALL' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.categoryId === categoryFilter);
    const byStatus = statusFilter === 'ALL' ? byCategory : byCategory.filter((p) => p.status === statusFilter);
    return sortProducts(byStatus, sort);
  }, [categoryFilter, statusFilter, sort]);

  const fetchPage = useCallback(
    async (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    },
    [filtered],
  );

  const list = usePaginatedList<Product>({ pageSize: 10, fetchPage });

  const categoryChips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    ...MOCK_CATEGORIES.map((c) => ({ key: c.id, label: c.name })),
  ];
  const statusChips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    { key: 'ACTIVE', label: t(STATUS_KEY.ACTIVE) },
    { key: 'OUT_OF_STOCK', label: t(STATUS_KEY.OUT_OF_STOCK) },
    { key: 'DISCONTINUED', label: t(STATUS_KEY.DISCONTINUED) },
  ];

  const sortLabel: Record<SortKey, string> = {
    nameAsc: t('products.sortNameAsc'),
    priceAsc: t('products.sortPriceAsc'),
    priceDesc: t('products.sortPriceDesc'),
    stockAsc: t('products.sortStockAsc'),
    stockDesc: t('products.sortStockDesc'),
  };

  return (
    <AdminScreen title={t('products.title')}>
      <View style={styles.headerRow}>
        <View style={styles.headerAction}>
          <Button variant="primary" size="sm" onPress={() => router.push('/(admin)/stock/products/create')}>
            {t('products.create')}
          </Button>
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
        <FilterBar chips={categoryChips} activeKey={categoryFilter} onSelect={setCategoryFilter} />
      </View>
      <View style={styles.filterWrap}>
        <FilterBar chips={statusChips} activeKey={statusFilter} onSelect={(key) => setStatusFilter(key as ProductStatus | 'ALL')} />
      </View>
      <DataList
        data={list.items}
        renderItem={({ item }) => <ProductRow product={item} />}
        keyExtractor={(item) => item.id}
        isLoading={list.isLoading}
        isEmpty={!list.isLoading && list.items.length === 0}
        emptyTitle={t('products.emptyTitle')}
        emptyMessage={t('products.emptyMessage')}
        emptyIcon={<Ionicons name="cube-outline" size={20} color={colors.leaf} />}
        errorMessage={list.errorMessage}
        onRetry={list.retry}
        onRefresh={list.refresh}
        refreshing={list.isRefreshing}
      />
      <ActionMenu
        visible={sortMenuOpen}
        onClose={() => setSortMenuOpen(false)}
        items={(Object.keys(sortLabel) as SortKey[]).map((key) => ({ label: sortLabel[key], onPress: () => setSort(key) }))}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingTop: space.md },
  headerAction: { flexShrink: 1 },
  sortButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  filterWrap: { paddingVertical: space.sm },
});
