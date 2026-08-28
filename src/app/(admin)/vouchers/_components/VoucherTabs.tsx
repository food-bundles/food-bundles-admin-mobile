import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type VoucherTabKey = 'loanApplications' | 'vouchers';

const TAB_KEY: Record<VoucherTabKey, TranslationKey> = {
  loanApplications: 'vouchers.tabLoanApplications',
  vouchers: 'vouchers.tabVouchers',
};

const TABS: VoucherTabKey[] = ['loanApplications', 'vouchers'];

export interface VoucherTabsProps {
  active: VoucherTabKey;
  onChange: (tab: VoucherTabKey) => void;
}

/** Top segmented control: Loan Applications | Vouchers. */
export function VoucherTabs({ active, onChange }: VoucherTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
