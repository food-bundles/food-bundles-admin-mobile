import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/charts/Sparkline';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES } from '@/mocks/market-prices';
import { MOCK_MARKETS } from '@/mocks/markets';

export interface ProductPriceComparisonProps {
  productName: string;
}

/**
 * Compact 7-day Sparkline for this product's FoodBundles price history, plus a market-price
 * comparison table across all 5 markets for today, with the FoodBundles row highlighted leaf when
 * it is the lowest. Falls back to nothing rendered when the product isn't one of the 5 tracked
 * commodities (most products in the catalogue aren't — only the 5 headline commodities have
 * market-price history in this mock dataset).
 */
export function ProductPriceComparison({ productName }: ProductPriceComparisonProps) {
  const { colors } = useTheme();
  const t = useT();
  const commodity = COMMODITIES.find((c) => c.name.toLowerCase() === productName.toLowerCase());
  if (!commodity) return null;

  const seriesForCommodity = MOCK_MARKET_PRICE_SERIES.filter((s) => s.commodityId === commodity.id);
  const fbSeries = seriesForCommodity.find((s) => s.marketId === 'mkt-001');
  const sparklineData = (fbSeries?.days ?? []).slice(-7).map((d, i) => ({ x: i, y: d.close }));

  const rows = MOCK_MARKETS.map((market) => {
    const series = seriesForCommodity.find((s) => s.marketId === market.id);
    return { market, price: series?.days.slice(-1)[0]?.close ?? 0 };
  });
  const lowestPrice = Math.min(...rows.filter((r) => r.price > 0).map((r) => r.price));

  return (
    <View style={styles.container}>
      <View style={styles.sparklineHeader}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('products.priceHistory')}</Text>
        <Sparkline data={sparklineData} colorKey="leaf" />
      </View>
      <Card>
        <Text style={[styles.tableTitle, { color: colors.ink }]}>{t('products.marketComparison')}</Text>
        {rows.map((row, index) => {
          const isLowest = row.market.isOwn && row.price === lowestPrice;
          return (
            <View
              key={row.market.id}
              style={[
                styles.row,
                index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline },
                isLowest && { backgroundColor: colors.tintLeaf },
              ]}
            >
              <Text style={[styles.marketName, { color: isLowest ? colors.leaf : colors.body }]}>{row.market.name}</Text>
              <Text style={[styles.price, { color: isLowest ? colors.leaf : colors.ink }]}>{formatRwf(row.price)}</Text>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  sparklineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...text.h3 },
  tableTitle: { ...text.bodySemi, marginBottom: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.sm, paddingHorizontal: space.xs, borderRadius: 8 },
  marketName: { ...text.body },
  price: { ...text.bodySemi },
});
