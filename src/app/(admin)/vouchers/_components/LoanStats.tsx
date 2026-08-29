import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { formatRwfNumber } from '@/lib/formatRwf';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_LOAN_APPLICATIONS } from '@/mocks/loanApplications';

/** 4 StatCards: Total, Pending, Approved, Rejected. */
export function LoanStats() {
  const t = useT();
  const total = MOCK_LOAN_APPLICATIONS.length;
  const pending = MOCK_LOAN_APPLICATIONS.filter((l) => l.status === 'PENDING').length;
  const approved = MOCK_LOAN_APPLICATIONS.filter((l) => l.status === 'APPROVED').length;
  const rejected = MOCK_LOAN_APPLICATIONS.filter((l) => l.status === 'REJECTED').length;

  return (
    <View style={styles.grid}>
      <View style={styles.tile}>
        <StatCard label={t('vouchers.statTotal')} value={formatRwfNumber(total)} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('vouchers.statPending')} value={formatRwfNumber(pending)} deltaTone="marigold" delta={pending > 0 ? String(pending) : undefined} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('vouchers.statApproved')} value={formatRwfNumber(approved)} deltaTone="ripe" delta={approved > 0 ? String(approved) : undefined} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('vouchers.statRejected')} value={formatRwfNumber(rejected)} deltaTone="chili" delta={rejected > 0 ? String(rejected) : undefined} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, paddingHorizontal: space.lg },
  tile: { width: '47%' },
});
