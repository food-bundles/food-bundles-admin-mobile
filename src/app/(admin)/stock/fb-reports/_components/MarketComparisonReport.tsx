import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import { commodityComparisonToday, savingsOpportunities } from './marketComparisonGenerators';

/** Commodity price comparison across all 5 markets for today, plus a "Savings opportunity" card. */
export function MarketComparisonReport() {
  const { colors } = useTheme();
  const t = useT();
  const rows = commodityComparisonToday();
  const opportunities = savingsOpportunities();

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.marketComparisonTitle')}</Text>
        {rows.map((row) => (
          <View key={row.commodityName} style={[styles.commodityBlock, { borderBottomColor: colors.hairline }]}>
            <Text style={[styles.commodityName, { color: colors.ink }]}>{row.commodityName}</Text>
            <BarChart
              data={row.pricesByMarket.map((entry, i) => ({ x: i, y: entry.price }))}
              colorKey="leaf"
              height={90}
            />
            {row.pricesByMarket.map((entry) => (
              <View key={entry.marketName} style={styles.priceRow}>
                <Text style={[styles.marketName, { color: colors.body }]}>{entry.marketName}</Text>
                <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(entry.price)}</Text>
              </View>
            ))}
          </View>
        ))}
      </Card>

      <View style={[styles.savingsCard, { backgroundColor: colors.tintMarigold, borderColor: colors.marigold }]}>
        <Text style={[styles.savingsTitle, { color: colors.ink }]}>{t('fbReports.savingsOpportunityTitle')}</Text>
        {opportunities.length === 0 ? (
          <Text style={[styles.savingsBody, { color: colors.body }]}>{t('fbReports.noSavingsOpportunities')}</Text>
        ) : (
          opportunities.map((op) => (
            <Text key={op.commodityName} style={[styles.savingsBody, { color: colors.body }]}>
              {t('fbReports.savingsLine', { commodity: op.commodityName, market: op.lowestMarketName, diff: op.differenceLabel })}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  commodityBlock: { paddingVertical: space.sm, borderBottomWidth: 1 },
  commodityName: { ...text.bodySemi, marginBottom: space.xs },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  marketName: { ...text.caption },
  price: { ...text.caption, fontWeight: '600' },
  savingsCard: { padding: space.md, borderRadius: 12, borderWidth: 1, gap: space.xs },
  savingsTitle: { ...text.bodySemi },
  savingsBody: { ...text.body },
});
