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
import { MOCK_AFFILIATORS, type Affiliator } from '@/mocks/affiliators';
import { AffiliatorRow } from './_components/AffiliatorRow';

/** Affiliator list: search by name/restaurant, pagination. */
export default function AffiliatorsScreen() {
  useRoleGuard('usersAffiliators');
  const { colors } = useTheme();
  const t = useT();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_AFFILIATORS;
    return MOCK_AFFILIATORS.filter((a) => a.name.toLowerCase().includes(q) || a.restaurantName.toLowerCase().includes(q));
  }, [search]);

  const fetchPage = useCallback(
    async (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      return { items: filtered.slice(start, start + pageSize), total: filtered.length };
    },
    [filtered],
  );

  const list = usePaginatedList<Affiliator>({ pageSize: 10, fetchPage });

  return (
    <AdminScreen title={t('affiliators.title')}>
      <View style={styles.searchWrap}>
        <Input label={t('common.search')} value={search} onChangeText={setSearch} placeholder={t('affiliators.searchPlaceholder')} />
      </View>
      <DataList
        data={list.items}
        renderItem={({ item }) => <AffiliatorRow affiliator={item} />}
        keyExtractor={(item) => item.id}
        isLoading={list.isLoading}
        isEmpty={!list.isLoading && list.items.length === 0}
        emptyTitle={t('affiliators.emptyTitle')}
        emptyMessage={t('affiliators.emptyMessage')}
        emptyIcon={<Ionicons name="people-outline" size={20} color={colors.leaf} />}
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
