import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { BarChart } from '@/components/charts/BarChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES, type CommodityId } from '@/mocks/market-prices';
import { MOCK_MARKETS } from '@/mocks/markets';
import { DatePickerField } from './DatePickerField';

const TODAY = new Date(2026, 7, 29);

/** Grouped bar chart: all markets for a selected commodity on a chosen date, FoodBundles best-price highlight. */
export function ComparisonTab() {
  const { colors } = useTheme();
  const t = useT();
  const [commodityId, setCommodityId] = useState<CommodityId>(COMMODITIES[0].id);
  const [date, setDate] = useState<Date>(TODAY);

  const seriesForCommodity = MOCK_MARKET_PRICE_SERIES.filter((s) => s.commodityId === commodityId);
  const dateIso = date.toISOString().slice(0, 10);

  const rows = useMemo(
    () =>
      MOCK_MARKETS.map((market) => {
        const series = seriesForCommodity.find((s) => s.marketId === market.id);
        const dayMatch = series?.days.find((d) => d.date === dateIso);
        const closest = dayMatch ?? series?.days[series.days.length - 1];
        return { market, price: closest?.close ?? 0 };
      }),
    [seriesForCommodity, dateIso],
  );

  const foodBundlesPrice = rows.find((r) => r.market.isOwn)?.price ?? 0;
  const bestPrice = Math.min(...rows.filter((r) => r.price > 0).map((r) => r.price));

  const chartData = rows.map((r, index) => ({ x: index, y: r.price }));
  const commodityChips: FilterChip[] = COMMODITIES.map((c) => ({ key: c.id, label: c.name }));

  return (
    <View style={styles.container}>
      <FilterBar chips={commodityChips} activeKey={commodityId} onSelect={(key) => setCommodityId(key as CommodityId)} />
      <DatePickerField label={t('markets.comparisonDate')} value={date} onChange={setDate} />

      <Text style={[styles.title, { color: colors.ink }]}>{t('markets.comparisonTitle')}</Text>
      <Card>
        <BarChart data={chartData} colorKey="leaf" height={180} />
      </Card>
      <Card>
        {rows.map((row, index) => {
          const pctDiff = foodBundlesPrice > 0 ? (((row.price - foodBundlesPrice) / foodBundlesPrice) * 100).toFixed(1) : '0.0';
          const isBest = row.price === bestPrice && row.price > 0;
          return (
            <View
              key={row.market.id}
              style={[styles.row, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            >
              <View style={styles.nameCol}>
                <Text style={[styles.marketName, { color: colors.ink }]}>{row.market.name}</Text>
                {isBest ? <Badge tone="leaf" label={t('markets.bestPriceBadge')} /> : null}
              </View>
              <View style={styles.valueCol}>
                <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(row.price)}</Text>
                {!row.market.isOwn ? (
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
  container: { gap: space.md, paddingBottom: space.xxxl },
  title: { ...text.h3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  nameCol: { gap: space.xs },
  marketName: { ...text.bodySemi },
  valueCol: { alignItems: 'flex-end' },
  price: { ...text.bodySemi },
  diff: { ...text.caption },
});
