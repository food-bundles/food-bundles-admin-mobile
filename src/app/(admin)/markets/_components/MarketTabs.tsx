import { useT, type TranslationKey } from '@/i18n';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type MarketTabKey = 'markets' | 'prices' | 'analysis' | 'comparison';

const TAB_KEY: Record<MarketTabKey, TranslationKey> = {
  markets: 'markets.tabMarkets',
  prices: 'markets.tabPrices',
  analysis: 'markets.tabAnalysis',
  comparison: 'markets.tabComparison',
};

const TABS: MarketTabKey[] = ['markets', 'prices', 'analysis', 'comparison'];

export interface MarketTabsProps {
  active: MarketTabKey;
  onChange: (tab: MarketTabKey) => void;
}

/** Top segmented control: Markets | Prices | Analysis | Comparison. */
export function MarketTabs({ active, onChange }: MarketTabsProps) {
  const t = useT();
  return <SegmentedTabs items={TABS.map((key) => ({ key, label: t(TAB_KEY[key]) }))} active={active} onChange={onChange} />;
}
