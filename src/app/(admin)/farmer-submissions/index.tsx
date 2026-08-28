import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_FARMER_SUBMISSIONS, type SubmissionStatus } from '@/mocks/farmer-submissions';
import { SubmissionRow } from './_components/SubmissionRow';

/** Farmer submissions: filters Pending | Approved | Rejected | Verified. */
export default function FarmerSubmissionsScreen() {
  useRoleGuard('operations');
  const { colors } = useTheme();
  const t = useT();
  const [filter, setFilter] = useState<SubmissionStatus | 'ALL'>('ALL');

  const filtered = filter === 'ALL' ? MOCK_FARMER_SUBMISSIONS : MOCK_FARMER_SUBMISSIONS.filter((s) => s.status === filter);

  const chips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    { key: 'PENDING', label: t('farmerSubmissions.statusPending') },
    { key: 'APPROVED', label: t('farmerSubmissions.statusApproved') },
    { key: 'REJECTED', label: t('farmerSubmissions.statusRejected') },
    { key: 'VERIFIED', label: t('farmerSubmissions.filterVerified') },
  ];

  return (
    <AdminScreen title={t('farmerSubmissions.title')}>
      <View style={styles.filterWrap}>
        <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as SubmissionStatus | 'ALL')} />
      </View>
      <DataList
        data={filtered}
        renderItem={({ item }) => <SubmissionRow submission={item} />}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={filtered.length === 0}
        emptyTitle={t('farmerSubmissions.emptyTitle')}
        emptyMessage={t('farmerSubmissions.emptyMessage')}
        emptyIcon={<Ionicons name="leaf-outline" size={20} color={colors.leaf} />}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  filterWrap: { paddingVertical: space.md },
});
