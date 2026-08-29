import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { BarChart } from '@/components/charts/BarChart';
import { MultiSeriesAreaChart, type MultiSeriesDatum, type MultiSeriesSpec } from '@/components/charts/MultiSeriesAreaChart';
import { Card } from '@/components/ui/Card';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { MOCK_ORDERS } from '@/mocks/orders';

function lastNDays(n: number, now: Date): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (n - 1 - i));
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type ChartMetric = 'revenue' | 'orders';

const SERIES_SPEC: MultiSeriesSpec[] = [
  { key: 'current', colorKey: 'leaf' },
  { key: 'lastWeek', colorKey: 'marigold', dashed: true },
];

export interface DashboardChartsProps {
  now?: Date;
}

/** Revenue/Orders toggle chart with a dashed "same period last week" overlay, plus new-registrations bar chart. */
export function DashboardCharts({ now = new Date() }: DashboardChartsProps) {
  const { colors } = useTheme();
  const t = useT();
  const [metric, setMetric] = useState<ChartMetric>('revenue');

  const days7 = lastNDays(7, now);
  const priorDays7 = lastNDays(7, new Date(now.getTime() - 7 * 86_400_000));

  const valueFor = (day: Date) => {
    const dayOrders = MOCK_ORDERS.filter((o) => isSameDay(new Date(o.createdAt), day));
    return metric === 'orders' ? dayOrders.length : dayOrders.reduce((sum, o) => sum + o.total, 0);
  };

  const chartData: MultiSeriesDatum[] = days7.map((d, i) => ({
    x: i,
    current: valueFor(d),
    lastWeek: valueFor(priorDays7[i]),
  }));

  const registrationsData = lastNDays(30, now).map((_, i) => ({ x: i, y: Math.round(2 + Math.sin(i / 4) * 2 + 2) }));

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.ink }]}>
            {metric === 'revenue' ? t('dashboard.revenueChart') : t('dashboard.ordersChart')}
          </Text>
          <SegmentedTabs
            items={[
              { key: 'revenue', label: t('dashboard.revenueToggleRevenue') },
              { key: 'orders', label: t('dashboard.revenueToggleOrders') },
            ]}
            active={metric}
            onChange={setMetric}
          />
        </View>
        <MultiSeriesAreaChart data={chartData} series={SERIES_SPEC} heroKey="current" height={160} />
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: colors.marigold }]} />
          <Text style={[styles.legendLabel, { color: colors.muted }]}>{t('dashboard.revenueLastWeek')}</Text>
        </View>
      </Card>
      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.usersChart')}</Text>
        <BarChart data={registrationsData} colorKey="ripe" height={160} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, paddingHorizontal: space.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  title: { ...text.h3 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { ...text.caption },
});
