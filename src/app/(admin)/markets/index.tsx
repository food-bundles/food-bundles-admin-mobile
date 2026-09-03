import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { MarketTabs, type MarketTabKey } from './_components/MarketTabs';
import { MarketsTab } from './_components/MarketsTab';
import { PricesTab } from './_components/PricesTab';
import { AnalysisTab } from './_components/AnalysisTab';
import { ComparisonTab } from './_components/ComparisonTab';

const VALID_TABS: MarketTabKey[] = ['markets', 'prices', 'analysis', 'comparison'];

/** Market Pricing: Markets | Prices | Analysis | Comparison tabs. Built from markets/page.tsx. Accepts an optional `?tab=` deep link (e.g. from the dashboard market widget). */
export default function MarketsScreen() {
  useRoleGuard('markets');
  const t = useT();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<MarketTabKey>(
    VALID_TABS.includes(initialTab as MarketTabKey) ? (initialTab as MarketTabKey) : 'markets',
  );

  return (
    <AdminScreen title={t('markets.title')}>
      <MarketTabs active={tab} onChange={setTab} />
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'markets' ? <MarketsTab /> : null}
        {tab === 'prices' ? <PricesTab /> : null}
        {tab === 'analysis' ? <AnalysisTab /> : null}
        {tab === 'comparison' ? <ComparisonTab /> : null}
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
