import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MultiSeriesAreaChart, type MultiSeriesDatum, type MultiSeriesSpec } from '@/components/charts/MultiSeriesAreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES, computeMovingAverage7, type CommodityId } from '@/mocks/market-prices';
import { MOCK_MARKETS } from '@/mocks/markets';

type RangeKey = 'day' | 'week' | 'month' | 'quarter';
const RANGE_DAYS: Record<RangeKey, number> = { day: 1, week: 7, month: 30, quarter: 30 };

const MARKET_SERIES_SPEC: MultiSeriesSpec[] = [
  { key: 'mkt-001', colorKey: 'leaf' },
  { key: 'mkt-002', colorKey: 'marigold', dashed: true },
  { key: 'mkt-003', colorKey: 'muted', dashed: true },
  { key: 'mkt-004', colorKey: 'pine', dashed: true },
  { key: 'mkt-005', colorKey: 'ripe', dashed: true },
];

/** Commodity selector + hero multi-series overlay chart + volume bars + 7-day MA toggle + record-price FAB. */
export function PricesTab() {
  const { colors } = useTheme();
  const t = useT();
  const [commodityId, setCommodityId] = useState<CommodityId>(COMMODITIES[0].id);
  const [range, setRange] = useState<RangeKey>('week');
  const [showMa, setShowMa] = useState(false);

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const seriesForCommodity = MOCK_MARKET_PRICE_SERIES.filter((s) => s.commodityId === commodityId);
  const daysWindow = RANGE_DAYS[range];

  const chartData: MultiSeriesDatum[] = useMemo(() => {
    const foodBundles = seriesForCommodity.find((s) => s.marketId === 'mkt-001');
    const length = foodBundles?.days.length ?? 0;
    const slice = Math.min(daysWindow, length);
    return Array.from({ length: slice }, (_, i) => {
      const idx = length - slice + i;
      const point: MultiSeriesDatum = { x: i };
      for (const series of seriesForCommodity) {
        point[series.marketId] = series.days[idx]?.close ?? 0;
      }
      return point;
    });
  }, [seriesForCommodity, daysWindow]);

  const foodBundlesSeries = seriesForCommodity.find((s) => s.marketId === 'mkt-001');
  const maValues = foodBundlesSeries ? computeMovingAverage7(foodBundlesSeries.days) : [];
  const maChartData = showMa
    ? chartData.map((point, i) => {
        const idx = (foodBundlesSeries?.days.length ?? 0) - chartData.length + i;
        return { ...point, ma: maValues[idx] ?? point['mkt-001'] };
      })
    : chartData;
  const maSpec: MultiSeriesSpec[] = showMa
    ? [...MARKET_SERIES_SPEC, { key: 'ma', colorKey: 'marigold', dashed: true }]
    : MARKET_SERIES_SPEC;

  const volumeData = (foodBundlesSeries?.days ?? []).slice(-daysWindow).map((d, i) => ({ x: i, y: d.volume }));

  const commodityChips: FilterChip[] = COMMODITIES.map((c) => ({ key: c.id, label: c.name }));
  const rangeChips: FilterChip[] = [
    { key: 'day', label: t('markets.rangeDay') },
    { key: 'week', label: t('markets.rangeWeek') },
    { key: 'month', label: t('markets.rangeMonth') },
    { key: 'quarter', label: t('markets.rangeQuarter') },
  ];

  return (
    <View style={styles.container}>
      <FilterBar chips={commodityChips} activeKey={commodityId} onSelect={(key) => setCommodityId(key as CommodityId)} />
      <FilterBar chips={rangeChips} activeKey={range} onSelect={(key) => setRange(key as RangeKey)} />

      <Card>
        <MultiSeriesAreaChart data={maChartData} series={maSpec} heroKey="mkt-001" height={220} />
        <Pressable
          onPress={() => setShowMa((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showMa }}
          accessibilityLabel={t('markets.showMovingAverage')}
          style={styles.maToggle}
        >
          <Ionicons name={showMa ? 'checkbox' : 'square-outline'} size={20} color={colors.leaf} />
          <Text style={[styles.maLabel, { color: colors.ink }]}>{t('markets.showMovingAverage')}</Text>
        </Pressable>

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
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('markets.volume')}</Text>
        <BarChart data={volumeData} colorKey="muted" height={120} />
      </Card>

      <Pressable
        onPress={() => router.push(`/(admin)/markets/mkt-001/record-price?productId=${commodity.productId}`)}
        accessibilityRole="button"
        accessibilityLabel={t('markets.recordPriceFab')}
        style={[styles.fab, shadow.elevated, { backgroundColor: colors.leaf }]}
      >
        <Ionicons name="add" size={26} color={colors.paper} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, paddingBottom: space.xxxl },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  maToggle: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.sm, minHeight: hit.min },
  maLabel: { ...text.body },
  legend: { marginTop: space.md, gap: space.xs },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { ...text.body, flex: 1 },
  legendValue: { ...text.bodySemi },
  fab: {
    position: 'absolute',
    right: space.lg,
    bottom: space.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
