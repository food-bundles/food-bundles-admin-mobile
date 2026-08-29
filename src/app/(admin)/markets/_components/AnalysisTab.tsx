import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { AreaChart } from '@/components/charts/AreaChart';
import { CandlestickChart, type OhlcDatum } from '@/components/charts/CandlestickChart';
import { Card } from '@/components/ui/Card';
import { PriceChangeBadge } from '@/components/ui/PriceChangeBadge';
import { Button } from '@/components/ui/Button';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { COMMODITIES, getSeries, rsiForCommodity, momentumForCommodity, type CommodityId } from '@/mocks/market-prices';
import { RsiGauge } from './RsiGauge';
import { MomentumRow } from './MomentumRow';
import { ComparePeriodsSheet } from './ComparePeriodsSheet';

type ChartMode = 'line' | 'candle';

/** Candlestick/line toggle, RSI gauge, momentum, "compare periods" sheet, best-time-to-order insight. */
export function AnalysisTab() {
  const { colors } = useTheme();
  const t = useT();
  const [commodityId, setCommodityId] = useState<CommodityId>(COMMODITIES[0].id);
  const [chartMode, setChartMode] = useState<ChartMode>('line');
  const [compareOpen, setCompareOpen] = useState(false);

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const series = getSeries(commodityId, 'mkt-001');
  const days = series?.days ?? [];
  const areaData = days.map((d, i) => ({ x: i, y: d.close }));
  const ohlcData: OhlcDatum[] = days.map((d, i) => ({ x: i, open: d.open, high: d.high, low: d.low, close: d.close }));

  const firstClose = areaData[0]?.y ?? 0;
  const lastClose = areaData[areaData.length - 1]?.y ?? 0;
  const pctChange = firstClose > 0 ? ((lastClose - firstClose) / firstClose) * 100 : 0;

  const rsi = rsiForCommodity(commodityId);
  const momentum = momentumForCommodity(commodityId);

  const commodityChips: FilterChip[] = COMMODITIES.map((c) => ({ key: c.id, label: c.name }));

  return (
    <View style={styles.container}>
      <FilterBar chips={commodityChips} activeKey={commodityId} onSelect={(key) => setCommodityId(key as CommodityId)} />

      <Card>
        <View style={styles.headerRow}>
          <PriceChangeBadge pct={pctChange} />
          <SegmentedTabs
            items={[
              { key: 'line', label: t('markets.chartLine') },
              { key: 'candle', label: t('markets.chartCandle') },
            ]}
            active={chartMode}
            onChange={setChartMode}
          />
        </View>
        {chartMode === 'line' ? <AreaChart data={areaData} colorKey="leaf" height={200} /> : <CandlestickChart data={ohlcData} height={200} />}
      </Card>

      <Card>
        <RsiGauge rsi={rsi} />
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('markets.tabAnalysis')}</Text>
        <MomentumRow momentum={momentum} />
      </Card>

      <Button variant="secondary" fullWidth onPress={() => setCompareOpen(true)}>
        {t('markets.comparePeriods')}
      </Button>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('markets.bestTimeToOrder')}</Text>
        <Text style={[styles.insight, { color: colors.body }]}>{t('markets.bestTimeToOrderHint', { commodity: commodity.name })}</Text>
      </Card>

      <ComparePeriodsSheet visible={compareOpen} commodityId={commodityId} onClose={() => setCompareOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, paddingBottom: space.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  insight: { ...text.body },
});
