import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { shareCsv } from '@/lib/exportCsv';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Button } from '@/components/ui/Button';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { generateReport, type ReportType } from './_components/reportGenerators';
import { SalesSummaryReport } from './_components/SalesSummaryReport';
import { StockMovementReport } from './_components/StockMovementReport';
import { MarketComparisonReport } from './_components/MarketComparisonReport';

type RangeKey = 'week' | 'month' | 'custom';

function presetRange(key: 'week' | 'month', now: Date): { from: Date; to: Date } {
  const to = now;
  const from = new Date(now);
  if (key === 'week') from.setDate(now.getDate() - 7);
  else from.setMonth(now.getMonth() - 1);
  return { from, to };
}

/**
 * Full F&B Reports: date range (this week default) + report type selector, each type rendering a
 * real chart-driven view (SalesSummaryReport / StockMovementReport / MarketComparisonReport)
 * instead of the previous generic 3-line summary card. Export shares a mock CSV; Refresh just
 * re-evaluates the generators against the current mock data (there is nothing to actually
 * re-fetch — this is a fully mocked app — so "refresh" resets the range to its default and
 * re-renders, which is the honest equivalent).
 */
export default function FbReportsScreen() {
  useRoleGuard('stock');
  const { colors } = useTheme();
  const t = useT();
  const [range, setRange] = useState<RangeKey>('week');
  const [customRange, setCustomRange] = useState(() => presetRange('week', new Date()));
  const [reportType, setReportType] = useState<ReportType>('SALES_SUMMARY');

  const { from, to } = range === 'custom' ? customRange : presetRange(range === 'month' ? 'month' : 'week', new Date());

  const rangeChips: FilterChip[] = [
    { key: 'week', label: t('fbReports.dateRangeThisWeek') },
    { key: 'month', label: t('fbReports.dateRangeThisMonth') },
    { key: 'custom', label: t('fbReports.dateRangeCustom') },
  ];
  const typeChips: FilterChip[] = [
    { key: 'SALES_SUMMARY', label: t('fbReports.typeSalesSummary') },
    { key: 'STOCK_MOVEMENT', label: t('fbReports.typeStockMovement') },
    { key: 'MARKET_COMPARISON', label: t('fbReports.typeMarketComparison') },
  ];

  const handleExport = () => {
    const summary = generateReport(reportType, from, to);
    shareCsv('fb-report.csv', summary.csv);
  };

  const handleRefresh = () => {
    setRange('week');
    setCustomRange(presetRange('week', new Date()));
  };

  return (
    <AdminScreen title={t('fbReports.title')}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.dateRangeThisWeek')}</Text>
          <Button variant="ghost" size="sm" onPress={handleRefresh}>
            {t('common.refresh')}
          </Button>
        </View>
        <FilterBar chips={rangeChips} activeKey={range} onSelect={(key) => setRange(key as RangeKey)} />
        {range === 'custom' ? (
          <DateRangePicker
            from={customRange.from}
            to={customRange.to}
            onChange={setCustomRange}
            fromLabel={t('fbReports.from')}
            toLabel={t('fbReports.to')}
            doneLabel={t('fbReports.done')}
          />
        ) : null}

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.reportType')}</Text>
        <FilterBar chips={typeChips} activeKey={reportType} onSelect={(key) => setReportType(key as ReportType)} />

        <View style={styles.reportWrap}>
          {reportType === 'SALES_SUMMARY' ? <SalesSummaryReport from={from} to={to} /> : null}
          {reportType === 'STOCK_MOVEMENT' ? <StockMovementReport from={from} to={to} /> : null}
          {reportType === 'MARKET_COMPARISON' ? <MarketComparisonReport /> : null}
        </View>

        <Button variant="secondary" fullWidth onPress={handleExport}>
          {t('common.export')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...text.h3 },
  reportWrap: { marginTop: space.sm },
});
