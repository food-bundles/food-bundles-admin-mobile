import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type NewsletterTabKey = 'subscribers' | 'campaigns';

const TAB_KEY: Record<NewsletterTabKey, TranslationKey> = {
  subscribers: 'newsletter.tabSubscribers',
  campaigns: 'newsletter.tabCampaigns',
};

const TABS: NewsletterTabKey[] = ['subscribers', 'campaigns'];

export interface NewsletterTabsProps {
  active: NewsletterTabKey;
  onChange: (tab: NewsletterTabKey) => void;
}

/** Top segmented control: Subscribers | Campaigns. */
export function NewsletterTabs({ active, onChange }: NewsletterTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
