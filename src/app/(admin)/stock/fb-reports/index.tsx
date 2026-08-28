import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { shareCsv } from '@/lib/exportCsv';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { generateReport, type ReportSummary, type ReportType } from './_components/reportGenerators';

type RangeKey = 'week' | 'month' | 'custom';

function presetRange(key: 'week' | 'month', now: Date): { from: Date; to: Date } {
  const to = now;
  const from = new Date(now);
  if (key === 'week') from.setDate(now.getDate() - 7);
  else from.setMonth(now.getMonth() - 1);
  return { from, to };
}

/** Date range (week/month/custom) + report type select, "Generate" → summary card, export via share sheet. */
export default function FbReportsScreen() {
  useRoleGuard('stock');
  const { colors } = useTheme();
  const t = useT();
  const [range, setRange] = useState<RangeKey>('week');
  const [customRange, setCustomRange] = useState(() => presetRange('week', new Date()));
  const [reportType, setReportType] = useState<ReportType>('SALES_SUMMARY');
  const [summary, setSummary] = useState<ReportSummary | null>(null);

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

  const handleGenerate = () => {
    const { from, to } = range === 'custom' ? customRange : presetRange(range, new Date());
    setSummary(generateReport(reportType, from, to));
  };

  return (
    <AdminScreen title={t('fbReports.title')}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.dateRangeThisWeek')}</Text>
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

        <View style={styles.generateWrap}>
          <Button variant="primary" fullWidth onPress={handleGenerate}>
            {t('fbReports.generate')}
          </Button>
        </View>

        {summary ? (
          <View style={styles.summaryWrap}>
            <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('fbReports.summaryTitle')}</Text>
            <Card>
              <SummaryRow label={t('fbReports.totalOrders')} value={String(summary.totalOrders)} />
              <SummaryRow label={t('fbReports.totalRevenue')} value={summary.totalRevenue} />
              <SummaryRow label={t('fbReports.avgOrderValue')} value={summary.avgOrderValue} />
            </Card>
            <Button variant="secondary" fullWidth onPress={() => shareCsv('fb-report.csv', summary.csv)}>
              {t('common.export')}
            </Button>
          </View>
        ) : null}
      </ScrollView>
    </AdminScreen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  sectionTitle: { ...text.h3 },
  generateWrap: { marginTop: space.md },
  summaryWrap: { gap: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.xs },
  rowLabel: { ...text.body },
  rowValue: { ...text.bodySemi },
});
