import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type RestaurantTabKey = 'info' | 'orders' | 'wallet' | 'affiliators' | 'vouchers' | 'consent';

const TAB_KEY: Record<RestaurantTabKey, TranslationKey> = {
  info: 'restaurants.tabInfo',
  orders: 'restaurants.tabOrders',
  wallet: 'restaurants.tabWallet',
  affiliators: 'restaurants.tabAffiliators',
  vouchers: 'restaurants.tabVouchers',
  consent: 'consent.tabTitle',
};

const TABS: RestaurantTabKey[] = ['info', 'orders', 'wallet', 'affiliators', 'vouchers', 'consent'];

export interface RestaurantTabsProps {
  active: RestaurantTabKey;
  onChange: (tab: RestaurantTabKey) => void;
}

/** Top segmented control: Info | Orders | Wallet | Affiliators | Vouchers | Data & Credit. */
export function RestaurantTabs({ active, onChange }: RestaurantTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
