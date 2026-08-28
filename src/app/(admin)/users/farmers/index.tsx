import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { usePaginatedList } from '@/lib/usePaginatedList';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Input } from '@/components/ui/Input';
import { MOCK_FARMERS, type Farmer } from '@/mocks/farmers';
import { FarmerRow } from './_components/FarmerRow';

/** Farmer list: search by name/farm name, pagination. Built from users/farmers/page.tsx. */
export default function FarmersScreen() {
  useRoleGuard('usersFarmers');
  const { colors } = useTheme();
  const t = useT();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_FARMERS;
    return MOCK_FARMERS.filter((f) => f.name.toLowerCase().includes(q) || f.farmName.toLowerCase().includes(q));
  }, [search]);

  const fetchPage = useCallback(
    async (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    },
    [filtered],
  );

  const list = usePaginatedList<Farmer>({ pageSize: 10, fetchPage });

  return (
    <AdminScreen title={t('farmers.title')}>
      <View style={styles.searchWrap}>
        <Input label={t('common.search')} value={search} onChangeText={setSearch} placeholder={t('farmers.searchPlaceholder')} />
      </View>
      <DataList
        data={list.items}
        renderItem={({ item }) => <FarmerRow farmer={item} />}
        keyExtractor={(item) => item.id}
        isLoading={list.isLoading}
        isEmpty={!list.isLoading && list.items.length === 0}
        emptyTitle={t('farmers.emptyTitle')}
        emptyMessage={t('farmers.emptyMessage')}
        emptyIcon={<Ionicons name="leaf-outline" size={20} color={colors.leaf} />}
        errorMessage={list.errorMessage}
        onRetry={list.retry}
        onRefresh={list.refresh}
        refreshing={list.isRefreshing}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md },
});
