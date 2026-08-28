import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { MOCK_LOAN_APPLICATIONS, type LoanApplication, type VoucherType } from '@/mocks/loans';
import { MOCK_VOUCHERS } from '@/mocks/vouchers';
import { VoucherTabs, type VoucherTabKey } from './_components/VoucherTabs';
import { LoanStats } from './_components/LoanStats';
import { LoanApplicationRow } from './_components/LoanApplicationRow';
import { LoanApplicationSheet } from './_components/LoanApplicationSheet';
import { VoucherRow } from './_components/VoucherRow';

/** Vouchers & Loans: Loan Applications | Vouchers tabs. Real discount-tier + credit-line model, no PAN/session-state. */
export default function VouchersScreen() {
  useRoleGuard('financial');
  const { colors } = useTheme();
  const t = useT();
  const [tab, setTab] = useState<VoucherTabKey>('loanApplications');
  const [applications, setApplications] = useState<LoanApplication[]>(MOCK_LOAN_APPLICATIONS);
  const [selected, setSelected] = useState<LoanApplication | null>(null);

  const handleApprove = (approvedAmount: number, repaymentDays: number, voucherType: VoucherType) => {
    if (!selected) return;
    setApplications((prev) =>
      prev.map((a) => (a.id === selected.id ? { ...a, status: 'APPROVED', approvedAmount, repaymentDays, voucherType } : a)),
    );
  };

  const handleReject = (reason: string) => {
    if (!selected) return;
    setApplications((prev) => prev.map((a) => (a.id === selected.id ? { ...a, status: 'REJECTED', rejectionReason: reason } : a)));
  };

  return (
    <AdminScreen title={t('vouchers.title')}>
      <VoucherTabs active={tab} onChange={setTab} />
      {tab === 'loanApplications' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <LoanStats />
          <DataList
            data={applications}
            renderItem={({ item }) => <LoanApplicationRow application={item} onPress={() => setSelected(item)} />}
            keyExtractor={(item) => item.id}
            isLoading={false}
            isEmpty={applications.length === 0}
            emptyTitle={t('vouchers.emptyLoansTitle')}
            emptyMessage={t('vouchers.emptyLoansMessage')}
            emptyIcon={<Ionicons name="document-text-outline" size={20} color={colors.leaf} />}
          />
        </ScrollView>
      ) : (
        <DataList
          data={MOCK_VOUCHERS}
          renderItem={({ item }) => <VoucherRow voucher={item} />}
          keyExtractor={(item) => item.id}
          isLoading={false}
          isEmpty={MOCK_VOUCHERS.length === 0}
          emptyTitle={t('vouchers.emptyVouchersTitle')}
          emptyMessage={t('vouchers.emptyVouchersMessage')}
          emptyIcon={<Ionicons name="ticket-outline" size={20} color={colors.leaf} />}
        />
      )}
      <LoanApplicationSheet application={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xxxl, gap: space.md },
});
