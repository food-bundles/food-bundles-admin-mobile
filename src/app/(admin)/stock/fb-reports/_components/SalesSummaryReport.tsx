import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { Sparkline } from '@/components/charts/Sparkline';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import {
  ordersInRange,
  revenueByDay,
  top5ProductsByRevenue,
  top5RestaurantsByValue,
  paymentMethodBreakdown,
  topProductByRevenue,
} from './reportGenerators';

export interface SalesSummaryReportProps {
  from: Date;
  to: Date;
}

const PAYMENT_COLOR: Record<string, string> = {
  CASH: '#17683F',
  MOBILE_MONEY: '#F5A524',
  CARD: '#1E9E57',
  VOUCHER: '#0E4A2B',
  BANK_TRANSFER: '#6B746D',
};

/** KPI row, revenue this-week-vs-last-week area chart, top 5 products/restaurants, payment method breakdown. */
export function SalesSummaryReport({ from, to }: SalesSummaryReportProps) {
  const { colors } = useTheme();
  const t = useT();
  const orders = ordersInRange(from, to);
  const lastWeekFrom = new Date(from.getTime() - (to.getTime() - from.getTime()));
  const lastWeekOrders = ordersInRange(lastWeekFrom, from);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const topProduct = topProductByRevenue(orders);
  const revenueSeries = revenueByDay(orders, from, to);
  const topProducts = top5ProductsByRevenue(orders);
  const topRestaurants = top5RestaurantsByValue(orders);
  const paymentRows = paymentMethodBreakdown(orders);

  return (
    <View style={styles.container}>
      <View style={styles.kpiRow}>
        <KpiTile label={t('fbReports.totalOrders')} value={String(orders.length)} />
        <KpiTile label={t('fbReports.totalRevenue')} value={formatRwf(totalRevenue)} />
        <KpiTile label={t('fbReports.avgOrderValue')} value={formatRwf(avgOrderValue)} />
        <KpiTile label={t('fbReports.topProduct')} value={topProduct} />
      </View>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.revenueChart')}</Text>
        <AreaChart data={revenueSeries} colorKey="leaf" height={180} />
        <Text style={[styles.caption, { color: colors.muted }]}>
          {t('fbReports.lastWeekOrders', { count: lastWeekOrders.length })}
        </Text>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.topProductsChart')}</Text>
        <BarChart data={topProducts.map((p, i) => ({ x: i, y: p.revenue }))} colorKey="leaf" height={140} />
        {topProducts.map((p) => (
          <Text key={p.name} style={[styles.row, { color: colors.body }]}>
            {p.name} — {formatRwf(p.revenue)}
          </Text>
        ))}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.topRestaurants')}</Text>
        {topRestaurants.map((r, index) => (
          <View key={r.name} style={styles.restaurantRow}>
            <Text style={[styles.rank, { color: colors.muted }]}>{index + 1}</Text>
            <Text style={[styles.restaurantName, { color: colors.ink }]} numberOfLines={1}>
              {r.name}
            </Text>
            <Sparkline data={r.sparkline} colorKey="leaf" />
            <Text style={[styles.rowValue, { color: colors.ink }]}>{formatRwf(r.total)}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.paymentBreakdown')}</Text>
        {paymentRows.map((row) => (
          <View key={row.method} style={styles.legendRow}>
            <View style={[styles.colorSquare, { backgroundColor: PAYMENT_COLOR[row.method] ?? colors.muted }]} />
            <Text style={[styles.legendLabel, { color: colors.body }]}>{t(PAYMENT_METHOD_KEY[row.method])}</Text>
            <Text style={[styles.legendPct, { color: colors.ink }]}>{row.pct.toFixed(0)}%</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.kpiTile, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <Text style={[styles.kpiValue, { color: colors.ink }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[styles.kpiLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  kpiTile: { flexBasis: '47%', flexGrow: 1, padding: space.md, borderRadius: 12, borderWidth: 1 },
  kpiValue: { ...text.h3 },
  kpiLabel: { ...text.caption, marginTop: 2 },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  caption: { ...text.caption, marginTop: space.xs },
  row: { ...text.body, marginTop: space.xs },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
  rank: { ...text.caption, width: 16 },
  restaurantName: { ...text.body, flex: 1 },
  rowValue: { ...text.bodySemi },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
  colorSquare: { width: 12, height: 12, borderRadius: 3 },
  legendLabel: { ...text.body, flex: 1 },
  legendPct: { ...text.bodySemi },
});
