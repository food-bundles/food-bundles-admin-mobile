import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type SubscriptionTabKey = 'plans' | 'restaurants';

const TAB_KEY: Record<SubscriptionTabKey, TranslationKey> = {
  plans: 'subscriptions.tabPlans',
  restaurants: 'subscriptions.tabRestaurants',
};

const TABS: SubscriptionTabKey[] = ['plans', 'restaurants'];

export interface SubscriptionTabsProps {
  active: SubscriptionTabKey;
  onChange: (tab: SubscriptionTabKey) => void;
}

/** Top segmented control: Plans | Restaurant Subscriptions. */
export function SubscriptionTabs({ active, onChange }: SubscriptionTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
