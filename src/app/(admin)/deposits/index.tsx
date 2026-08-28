import { useState } from 'react';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DepositTabs, type DepositTabKey } from './_components/DepositTabs';
import { WalletsTab } from './_components/WalletsTab';
import { TransactionsTab } from './_components/TransactionsTab';
import { WithdrawalsTab } from './_components/WithdrawalsTab';
import { DelegationTab } from './_components/DelegationTab';

/** Deposits & Wallets: Wallets | Transactions | Withdrawals | Delegation tabs. Built from deposits/page.tsx. */
export default function DepositsScreen() {
  useRoleGuard('financial');
  const t = useT();
  const [tab, setTab] = useState<DepositTabKey>('wallets');

  return (
    <AdminScreen title={t('deposits.title')}>
      <DepositTabs active={tab} onChange={setTab} />
      {tab === 'wallets' ? <WalletsTab /> : null}
      {tab === 'transactions' ? <TransactionsTab /> : null}
      {tab === 'withdrawals' ? <WithdrawalsTab /> : null}
      {tab === 'delegation' ? <DelegationTab /> : null}
    </AdminScreen>
  );
}
