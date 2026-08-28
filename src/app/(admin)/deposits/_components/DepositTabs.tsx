import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type DepositTabKey = 'wallets' | 'transactions' | 'withdrawals' | 'delegation';

const TAB_KEY: Record<DepositTabKey, TranslationKey> = {
  wallets: 'deposits.tabWallets',
  transactions: 'deposits.tabTransactions',
  withdrawals: 'deposits.tabWithdrawals',
  delegation: 'deposits.tabDelegation',
};

const TABS: DepositTabKey[] = ['wallets', 'transactions', 'withdrawals', 'delegation'];

export interface DepositTabsProps {
  active: DepositTabKey;
  onChange: (tab: DepositTabKey) => void;
}

/** Top segmented control: Wallets | Transactions | Withdrawals | Delegation. */
export function DepositTabs({ active, onChange }: DepositTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
