import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { CandlestickChart, type OhlcDatum } from '@/components/charts/CandlestickChart';
import { MultiSeriesAreaChart, type MultiSeriesDatum, type MultiSeriesSpec } from '@/components/charts/MultiSeriesAreaChart';
import { Card } from '@/components/ui/Card';
import { PriceChangeBadge } from '@/components/ui/PriceChangeBadge';
import { Button } from '@/components/ui/Button';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES, getSeries, rsiForCommodity, momentumForCommodity, type CommodityId } from '@/mocks/market-prices';
import { MOCK_MARKETS } from '@/mocks/markets';
import { RsiGauge } from './RsiGauge';
import { MomentumRow } from './MomentumRow';
import { ComparePeriodsSheet } from './ComparePeriodsSheet';

type ChartMode = 'line' | 'candle';

const MARKET_SERIES_SPEC: MultiSeriesSpec[] = [
  { key: 'mkt-001', colorKey: 'leaf' },
  { key: 'mkt-002', colorKey: 'marigold', dashed: true },
  { key: 'mkt-003', colorKey: 'muted', dashed: true },
  { key: 'mkt-004', colorKey: 'pine', dashed: true },
  { key: 'mkt-005', colorKey: 'ripe', dashed: true },
];

/** All-markets multi-series overlay/candlestick toggle, RSI gauge, momentum, "compare periods" sheet, best-time-to-order insight. */
export function AnalysisTab() {
  const { colors } = useTheme();
  const t = useT();
  const [commodityId, setCommodityId] = useState<CommodityId>(COMMODITIES[0].id);
  const [chartMode, setChartMode] = useState<ChartMode>('line');
  const [compareOpen, setCompareOpen] = useState(false);

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const seriesForCommodity = MOCK_MARKET_PRICE_SERIES.filter((s) => s.commodityId === commodityId);
  const ownSeries = getSeries(commodityId, 'mkt-001');
  const ownDays = ownSeries?.days ?? [];
  const ohlcData: OhlcDatum[] = ownDays.map((d, i) => ({ x: i, open: d.open, high: d.high, low: d.low, close: d.close }));

  const overlayData: MultiSeriesDatum[] = useMemo(() => {
    const length = ownDays.length;
    return Array.from({ length }, (_, i) => {
      const point: MultiSeriesDatum = { x: i };
      for (const series of seriesForCommodity) {
        point[series.marketId] = series.days[i]?.close ?? 0;
      }
      return point;
    });
  }, [seriesForCommodity, ownDays.length]);

  const firstClose = ownDays[0]?.close ?? 0;
  const lastClose = ownDays[ownDays.length - 1]?.close ?? 0;
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
        {chartMode === 'line' ? (
          <>
            <MultiSeriesAreaChart data={overlayData} series={MARKET_SERIES_SPEC} heroKey="mkt-001" height={200} />
            <View style={styles.legend}>
              {MARKET_SERIES_SPEC.map((spec) => {
                const market = MOCK_MARKETS.find((m) => m.id === spec.key);
                const latest = seriesForCommodity.find((s) => s.marketId === spec.key)?.days.slice(-1)[0]?.close ?? 0;
                return (
                  <View key={spec.key} style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: colors[spec.colorKey] }]} />
                    <Text style={[styles.legendName, { color: colors.body }]}>{market?.name}</Text>
                    <Text style={[styles.legendValue, { color: colors.ink }]}>{formatRwf(latest)}</Text>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <CandlestickChart data={ohlcData} height={200} />
            <Text style={[styles.candleHint, { color: colors.muted }]}>{t('markets.candleOwnMarketOnly')}</Text>
          </>
        )}
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
  legend: { marginTop: space.md, gap: space.xs },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { ...text.body, flex: 1 },
  legendValue: { ...text.bodySemi },
  candleHint: { ...text.caption, marginTop: space.sm },
});
