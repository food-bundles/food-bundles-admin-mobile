import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Badge } from '@/components/ui/Badge';
import { MultiSeriesAreaChart, type MultiSeriesDatum, type MultiSeriesSpec } from '@/components/charts/MultiSeriesAreaChart';
import { comparisonSeries, type CommodityId, type ComparisonPreset } from '@/mocks/market-prices';

export interface ComparePeriodsSheetProps {
  visible: boolean;
  commodityId: CommodityId;
  onClose: () => void;
}

const SERIES_SPEC: MultiSeriesSpec[] = [
  { key: 'current', colorKey: 'leaf' },
  { key: 'previous', colorKey: 'muted', dashed: true },
];

/** Two period selectors (Week/Month/Quarter) → overlapping area charts → net difference badge. */
export function ComparePeriodsSheet({ visible, commodityId, onClose }: ComparePeriodsSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [preset, setPreset] = useState<ComparisonPreset>('WEEK');

  const { current, previous } = useMemo(() => comparisonSeries(commodityId, preset), [commodityId, preset]);
  const chartData: MultiSeriesDatum[] = current.map((value, i) => ({ x: i, current: value, previous: previous[i] ?? value }));

  const currentAvg = current.length > 0 ? current.reduce((a, b) => a + b, 0) / current.length : 0;
  const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : 0;
  const netDiff = Math.round(currentAvg - previousAvg);
  const isUp = netDiff >= 0;

  return (
    <Sheet visible={visible} height="tall" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('markets.comparePeriods')}</Text>
        <SegmentedTabs
          items={[
            { key: 'WEEK', label: t('markets.periodWeek') },
            { key: 'MONTH', label: t('markets.periodMonth') },
            { key: 'QUARTER', label: t('markets.periodQuarter') },
          ]}
          active={preset}
          onChange={setPreset}
        />
        <MultiSeriesAreaChart data={chartData} series={SERIES_SPEC} heroKey="current" height={180} />
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: colors.leaf }]} />
            <Text style={[styles.legendLabel, { color: colors.body }]}>{t('markets.currentPeriod')}</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: colors.muted }]} />
            <Text style={[styles.legendLabel, { color: colors.body }]}>{t('markets.previousPeriod')}</Text>
          </View>
        </View>
        <Badge tone={isUp ? 'chili' : 'ripe'} label={t('markets.netDifference', { value: `${isUp ? '+' : ''}${formatRwf(netDiff)}` })} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, padding: space.lg },
  title: { ...text.h3 },
  legend: { flexDirection: 'row', gap: space.lg },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { ...text.caption },
});
