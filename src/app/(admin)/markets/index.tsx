import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { MarketTabs, type MarketTabKey } from './_components/MarketTabs';
import { MarketsTab } from './_components/MarketsTab';
import { PricesTab } from './_components/PricesTab';
import { AnalysisTab } from './_components/AnalysisTab';
import { ComparisonTab } from './_components/ComparisonTab';

/** Market Pricing: Markets | Prices | Analysis | Comparison tabs. Built from markets/page.tsx. */
export default function MarketsScreen() {
  useRoleGuard('markets');
  const t = useT();
  const [tab, setTab] = useState<MarketTabKey>('markets');

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
