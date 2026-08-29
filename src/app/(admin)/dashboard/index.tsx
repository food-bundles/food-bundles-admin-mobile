import { ScrollView, StyleSheet } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { computeDashboardMetrics } from '@/lib/dashboardMetrics';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DashboardGreeting } from './_components/DashboardGreeting';
import { QuickStatsGrid } from './_components/QuickStatsGrid';
import { DashboardCharts } from './_components/DashboardCharts';
import { RecentActivity } from './_components/RecentActivity';
import { MarketSummaryWidget } from './_components/MarketSummaryWidget';
import { SystemStatusRow } from './_components/SystemStatusRow';

/**
 * Dashboard home: greeting, 6-tile KPI grid, 3 charts, recent activity,
 * system status. Built from the real dashboard/page.tsx + DashboardContent.tsx
 * + QuickStats.tsx + EnhancedMetricCard.tsx structure, not the screen-specs
 * skill's abbreviated "6 stat cards" summary.
 */
export default function DashboardHome() {
  const t = useT();
  const user = useAuthStore((state) => state.user);
  const metrics = computeDashboardMetrics();

  return (
    <AdminScreen title={t('nav.dashboard')}>
      <ScrollView contentContainerStyle={styles.content}>
        <DashboardGreeting name={user?.name ?? ''} />
        <QuickStatsGrid metrics={metrics} />
        <DashboardCharts />
        <RecentActivity />
        <MarketSummaryWidget />
        <SystemStatusRow />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xxxl, gap: space.xl },
});
