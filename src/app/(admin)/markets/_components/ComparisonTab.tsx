import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { BarChart } from '@/components/charts/BarChart';
import { Card } from '@/components/ui/Card';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_MARKETS } from '@/mocks/markets';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_MARKET_PRICES } from '@/mocks/market-prices';

/** Side-by-side bar chart for the selected commodity: FoodBundles vs. each other market, with percentage diffs. */
export function ComparisonTab() {
  const { colors } = useTheme();
  const t = useT();
  const trackedProductIds = [...new Set(MOCK_MARKET_PRICES.map((s) => s.productId))];
  const products = MOCK_PRODUCTS.filter((p) => trackedProductIds.includes(p.id));
  const [productId, setProductId] = useState(products[0]?.id ?? '');

  const seriesForProduct = MOCK_MARKET_PRICES.filter((s) => s.productId === productId);
  const foodBundlesLatest = seriesForProduct.find((s) => s.marketId === 'mkt-001')?.days.slice(-1)[0]?.close ?? 0;

  const chartData = seriesForProduct.map((s, index) => ({
    x: index,
    y: s.days[s.days.length - 1]?.close ?? 0,
  }));

  const productChips: FilterChip[] = products.map((p) => ({ key: p.id, label: p.name }));

  return (
    <View style={styles.container}>
      <FilterBar chips={productChips} activeKey={productId} onSelect={setProductId} />
      <Text style={[styles.title, { color: colors.ink }]}>{t('markets.comparisonTitle')}</Text>
      <Card>
        <BarChart data={chartData} colorKey="leaf" height={180} />
      </Card>
      <Card>
        {seriesForProduct.map((series, index) => {
          const market = MOCK_MARKETS.find((m) => m.id === series.marketId);
          const latest = series.days[series.days.length - 1]?.close ?? 0;
          const pctDiff = foodBundlesLatest > 0 ? (((latest - foodBundlesLatest) / foodBundlesLatest) * 100).toFixed(1) : '0.0';
          return (
            <View
              key={series.marketId}
              style={[styles.row, index < seriesForProduct.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            >
              <Text style={[styles.marketName, { color: colors.ink }]}>{market?.name}</Text>
              <View style={styles.valueCol}>
                <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(latest)}</Text>
                {market?.id !== 'mkt-001' ? (
                  <Text style={[styles.diff, { color: Number(pctDiff) > 0 ? colors.chili : colors.ripe }]}>
                    {t('markets.percentDiff', { pct: pctDiff })}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  title: { ...text.h3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  marketName: { ...text.bodySemi },
  valueCol: { alignItems: 'flex-end' },
  price: { ...text.bodySemi },
  diff: { ...text.caption },
});
