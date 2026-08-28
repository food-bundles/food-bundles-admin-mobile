import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { Card } from '@/components/ui/Card';
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

export interface DashboardChartsProps {
  now?: Date;
}

/** Orders (7-day area), Revenue (7-day area), New registrations (30-day bar). */
export function DashboardCharts({ now = new Date() }: DashboardChartsProps) {
  const { colors } = useTheme();
  const t = useT();

  const days7 = lastNDays(7, now);
  const ordersData = days7.map((d, i) => ({
    x: i,
    y: MOCK_ORDERS.filter((o) => isSameDay(new Date(o.createdAt), d)).length,
  }));
  const revenueData = days7.map((d, i) => ({
    x: i,
    y: MOCK_ORDERS.filter((o) => isSameDay(new Date(o.createdAt), d)).reduce((sum, o) => sum + o.total, 0),
  }));
  const registrationsData = lastNDays(30, now).map((_, i) => ({ x: i, y: Math.round(2 + Math.sin(i / 4) * 2 + 2) }));

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.ordersChart')}</Text>
        <AreaChart data={ordersData} colorKey="leaf" height={160} />
      </Card>
      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.revenueChart')}</Text>
        <AreaChart data={revenueData} colorKey="marigold" height={160} />
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
  title: { ...text.h3, marginBottom: space.sm },
});
