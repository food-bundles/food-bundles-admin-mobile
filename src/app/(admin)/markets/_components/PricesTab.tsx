import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_MARKETS } from '@/mocks/markets';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_MARKET_PRICES } from '@/mocks/market-prices';

/** Commodity × market grid: latest price + date per cell, filterable by market or commodity. */
export function PricesTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const [marketFilter, setMarketFilter] = useState<string>('ALL');

  const trackedProductIds = [...new Set(MOCK_MARKET_PRICES.map((s) => s.productId))];
  const products = MOCK_PRODUCTS.filter((p) => trackedProductIds.includes(p.id));
  const markets = marketFilter === 'ALL' ? MOCK_MARKETS : MOCK_MARKETS.filter((m) => m.id === marketFilter);

  const marketChips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    ...MOCK_MARKETS.map((m) => ({ key: m.id, label: m.name })),
  ];

  return (
    <View style={styles.container}>
      <FilterBar chips={marketChips} activeKey={marketFilter} onSelect={setMarketFilter} />
      {products.map((product) => (
        <View key={product.id} style={styles.productSection}>
          <Text style={[styles.productName, { color: colors.ink }]}>{product.name}</Text>
          <Card>
            {markets.map((market, index) => {
              const series = MOCK_MARKET_PRICES.find((s) => s.marketId === market.id && s.productId === product.id);
              const latest = series?.days[series.days.length - 1];
              return (
                <View
                  key={market.id}
                  style={[styles.row, index < markets.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
                >
                  <View style={styles.textCol}>
                    <Text style={[styles.marketName, { color: colors.ink }]}>{market.name}</Text>
                    {latest ? (
                      <Text style={[styles.detail, { color: colors.muted }]}>
                        {t('markets.latestPrice', { price: formatRwf(latest.close) })} · {formatDate(latest.date, language)}
                      </Text>
                    ) : (
                      <Text style={[styles.detail, { color: colors.muted }]}>{t('markets.noRecentPrice')}</Text>
                    )}
                  </View>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push(`/(admin)/markets/${market.id}/record-price?productId=${product.id}`)}
                  >
                    {t('markets.recordPrice')}
                  </Button>
                </View>
              );
            })}
          </Card>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  productSection: { gap: space.xs },
  productName: { ...text.h3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  textCol: { flex: 1 },
  marketName: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
