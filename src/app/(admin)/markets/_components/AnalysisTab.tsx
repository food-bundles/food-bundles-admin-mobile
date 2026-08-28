import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { AreaChart } from '@/components/charts/AreaChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_MARKETS } from '@/mocks/markets';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_MARKET_PRICES } from '@/mocks/market-prices';

type RangeKey = 'day' | 'week' | 'month' | 'quarter';

/** AreaChart for the selected commodity (FoodBundles series), 4 time-range presets, best-price highlight. */
export function AnalysisTab() {
  const { colors } = useTheme();
  const t = useT();
  const trackedProductIds = [...new Set(MOCK_MARKET_PRICES.map((s) => s.productId))];
  const products = MOCK_PRODUCTS.filter((p) => trackedProductIds.includes(p.id));
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [range, setRange] = useState<RangeKey>('week');

  const seriesForProduct = MOCK_MARKET_PRICES.filter((s) => s.productId === productId);
  const bestSeries = useMemo(() => {
    return seriesForProduct.reduce<typeof seriesForProduct[number] | null>((best, s) => {
      const lastClose = s.days[s.days.length - 1]?.close ?? Infinity;
      const bestClose = best?.days[best.days.length - 1]?.close ?? Infinity;
      return lastClose < bestClose ? s : best;
    }, null);
  }, [seriesForProduct]);

  const foodBundlesSeries = seriesForProduct.find((s) => s.marketId === 'mkt-001');
  const chartData = (foodBundlesSeries ?? seriesForProduct[0])?.days.map((d, i) => ({ x: i, y: d.close })) ?? [];

  const firstClose = chartData[0]?.y ?? 0;
  const lastClose = chartData[chartData.length - 1]?.y ?? 0;
  const pctChange = firstClose > 0 ? (((lastClose - firstClose) / firstClose) * 100).toFixed(1) : '0.0';
  const isUp = Number(pctChange) >= 0;

  const productChips: FilterChip[] = products.map((p) => ({ key: p.id, label: p.name }));
  const rangeChips: FilterChip[] = [
    { key: 'day', label: t('markets.rangeDay') },
    { key: 'week', label: t('markets.rangeWeek') },
    { key: 'month', label: t('markets.rangeMonth') },
    { key: 'quarter', label: t('markets.rangeQuarter') },
  ];

  return (
    <View style={styles.container}>
      <FilterBar chips={productChips} activeKey={productId} onSelect={setProductId} />
      <FilterBar chips={rangeChips} activeKey={range} onSelect={(key) => setRange(key as RangeKey)} />
      <Card>
        <View style={styles.badgeRow}>
          <Badge tone={isUp ? 'ripe' : 'chili'} label={t(isUp ? 'markets.priceChangeUp' : 'markets.priceChangeDown', { pct: pctChange })} />
          {bestSeries ? <Badge tone="leaf" label={t('markets.bestPrice')} /> : null}
        </View>
        <AreaChart data={chartData} colorKey="leaf" height={200} />
      </Card>
      <Card>
        {seriesForProduct.map((series, index) => {
          const market = MOCK_MARKETS.find((m) => m.id === series.marketId);
          const latest = series.days[series.days.length - 1]?.close ?? 0;
          const isBest = series === bestSeries;
          return (
            <View
              key={series.marketId}
              style={[styles.legendRow, index < seriesForProduct.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            >
              <Text style={[styles.legendName, { color: isBest ? colors.leaf : colors.ink }]}>{market?.name}</Text>
              <Text style={[styles.legendValue, { color: isBest ? colors.leaf : colors.muted }]}>{formatRwf(latest)}</Text>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  badgeRow: { flexDirection: 'row', gap: space.sm, marginBottom: space.sm },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.sm },
  legendName: { ...text.bodySemi },
  legendValue: { ...text.bodySemi },
});
