import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf, formatRwfNumber } from '@/lib/formatRwf';
import { StatCard } from '@/components/ui/StatCard';
import { StaggerIn } from '@/components/ui/StaggerIn';
import type { DashboardMetrics } from '@/lib/dashboardMetrics';

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

export interface QuickStatsGridProps {
  metrics: DashboardMetrics;
}

/** 6-tile KPI grid, 2 columns. Tapping a tile navigates to its section. */
export function QuickStatsGrid({ metrics }: QuickStatsGridProps) {
  const t = useT();

  return (
    <View style={styles.grid}>
      <View style={styles.tile}>
        <StaggerIn index={0}>
          <StatCard
            label={t('dashboard.ordersToday')}
            value={formatRwfNumber(metrics.ordersToday)}
            delta={delta(metrics.ordersToday, metrics.ordersYesterday)}
            onPress={() => router.push('/(admin)/orders')}
          />
        </StaggerIn>
      </View>
      <View style={styles.tile}>
        <StaggerIn index={1}>
          <StatCard
            label={t('dashboard.revenueToday')}
            value={formatRwf(metrics.revenueToday)}
            delta={delta(metrics.revenueToday, metrics.revenueYesterday)}
            onPress={() => router.push('/(admin)/orders')}
          />
        </StaggerIn>
      </View>
      <View style={styles.tile}>
        <StaggerIn index={2}>
          <StatCard
            label={t('dashboard.activeRestaurants')}
            value={formatRwfNumber(metrics.activeRestaurants)}
            delta={delta(metrics.activeRestaurants, metrics.activeRestaurantsLastWeek)}
            onPress={() => router.push('/(admin)/users/restaurants')}
          />
        </StaggerIn>
      </View>
      <View style={styles.tile}>
        <StaggerIn index={3}>
          <StatCard
            label={t('dashboard.pendingVouchers')}
            value={formatRwfNumber(metrics.pendingVouchers)}
            delta={metrics.pendingVouchers > 0 ? t('common.pendingCount', { count: metrics.pendingVouchers }) : undefined}
            deltaTone="chili"
            onPress={() => router.push('/(admin)/vouchers')}
          />
        </StaggerIn>
      </View>
      <View style={styles.tile}>
        <StaggerIn index={4}>
          <StatCard
            label={t('dashboard.pendingSubmissions')}
            value={formatRwfNumber(metrics.pendingSubmissions)}
            delta={metrics.pendingSubmissions > 0 ? t('common.pendingCount', { count: metrics.pendingSubmissions }) : undefined}
            deltaTone="chili"
            onPress={() => router.push('/(admin)/farmer-submissions')}
          />
        </StaggerIn>
      </View>
      <View style={styles.tile}>
        <StaggerIn index={5}>
          <StatCard
            label={t('dashboard.unreadContacts')}
            value={formatRwfNumber(metrics.unreadContacts)}
            delta={metrics.unreadContacts > 0 ? t('common.pendingCount', { count: metrics.unreadContacts }) : undefined}
            deltaTone="chili"
            onPress={() => router.push('/(admin)/contact-submissions')}
          />
        </StaggerIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, paddingHorizontal: space.lg },
  tile: { width: '47%' },
});
