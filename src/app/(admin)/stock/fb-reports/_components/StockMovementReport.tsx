import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { MultiSeriesAreaChart, type MultiSeriesSpec } from '@/components/charts/MultiSeriesAreaChart';
import { stockMovementByDay, productsBelowThreshold, turnoverRates } from './stockMovementGenerators';

export interface StockMovementReportProps {
  from: Date;
  to: Date;
}

const SERIES_SPEC: MultiSeriesSpec[] = [
  { key: 'stockIn', colorKey: 'leaf' },
  { key: 'stockOut', colorKey: 'chili', dashed: true },
];

/** Stock-in vs. stock-out chart, products below reorder threshold, turnover rate table, low-stock alert. */
export function StockMovementReport({ from, to }: StockMovementReportProps) {
  const { colors } = useTheme();
  const t = useT();
  const movement = stockMovementByDay(from, to);
  const belowThreshold = productsBelowThreshold();
  const turnover = turnoverRates(from, to);
  const criticalLowStock = belowThreshold.filter((p) => p.stock < 5);

  return (
    <View style={styles.container}>
      {criticalLowStock.length > 0 ? (
        <View style={[styles.alertCard, { backgroundColor: colors.tintChili, borderColor: colors.chili }]}>
          <Text style={[styles.alertTitle, { color: colors.chili }]}>{t('fbReports.lowStockAlert', { count: criticalLowStock.length })}</Text>
        </View>
      ) : null}

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.stockMovementChart')}</Text>
        <MultiSeriesAreaChart data={movement.map((m) => ({ x: m.x, stockIn: m.stockIn, stockOut: m.stockOut }))} series={SERIES_SPEC} heroKey="stockIn" height={180} />
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.belowThreshold')}</Text>
        {belowThreshold.length === 0 ? (
          <Text style={[styles.body, { color: colors.muted }]}>{t('fbReports.noLowStock')}</Text>
        ) : (
          belowThreshold.map((p) => (
            <View key={p.id} style={[styles.thresholdRow, { borderLeftColor: colors.chili }]}>
              <Text style={[styles.body, { color: colors.ink }]}>{p.name}</Text>
              <Text style={[styles.caption, { color: colors.muted }]}>
                {p.stock} / {p.reorderThreshold}
              </Text>
            </View>
          ))
        )}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.turnoverTable')}</Text>
        {turnover.map((row) => (
          <View key={row.id} style={styles.turnoverRow}>
            <Text style={[styles.body, { color: colors.ink, flex: 1 }]} numberOfLines={1}>
              {row.name}
            </Text>
            <Text style={[styles.caption, { color: colors.muted }]}>{row.avgDailySales}/day</Text>
            <Text style={[styles.caption, { color: colors.muted }]}>{row.daysOfStock}d</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  alertCard: { padding: space.md, borderRadius: 12, borderWidth: 1 },
  alertTitle: { ...text.bodySemi },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  body: { ...text.body },
  caption: { ...text.caption },
  thresholdRow: { borderLeftWidth: 3, paddingLeft: space.sm, paddingVertical: space.xs, marginBottom: space.xs },
  turnoverRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
});
