import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Gauge } from '@/components/charts/Gauge';
import { BarChart } from '@/components/charts/BarChart';
import type { Campaign } from '@/mocks/newsletter';

export interface PerformanceSectionProps {
  campaign: Campaign;
}

/** SENT campaigns only: open-rate + click-rate arc gauges, recipient count, "Opened vs Not opened" 2-bar chart. */
export function PerformanceSection({ campaign }: PerformanceSectionProps) {
  const { colors } = useTheme();
  const t = useT();
  const opened = Math.round(campaign.recipientCount * campaign.openRate);
  const notOpened = campaign.recipientCount - opened;

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('newsletter.performanceTitle')}</Text>
      <View style={styles.gaugeRow}>
        <View style={styles.gaugeCol}>
          <Gauge value={campaign.openRate * 100} max={100} size={88} colorKey="leaf" />
          <Text style={[styles.gaugeLabel, { color: colors.ink }]}>{(campaign.openRate * 100).toFixed(0)}%</Text>
          <Text style={[styles.gaugeCaption, { color: colors.muted }]}>{t('newsletter.openRate')}</Text>
        </View>
        <View style={styles.gaugeCol}>
          <Gauge value={campaign.clickRate * 100} max={100} size={88} colorKey="marigold" />
          <Text style={[styles.gaugeLabel, { color: colors.ink }]}>{(campaign.clickRate * 100).toFixed(0)}%</Text>
          <Text style={[styles.gaugeCaption, { color: colors.muted }]}>{t('newsletter.clickRate')}</Text>
        </View>
      </View>
      <Text style={[styles.recipientCount, { color: colors.body }]}>{t('newsletter.recipients', { count: campaign.recipientCount })}</Text>

      <Text style={[styles.chartTitle, { color: colors.ink }]}>{t('newsletter.openedVsNotOpened')}</Text>
      <BarChart
        data={[{ x: 0, y: opened }, { x: 1, y: notOpened }]}
        colorKey="leaf"
        height={100}
      />
      <View style={styles.legendRow}>
        <Text style={[styles.legendLabel, { color: colors.muted }]}>{t('newsletter.opened', { count: opened })}</Text>
        <Text style={[styles.legendLabel, { color: colors.muted }]}>{t('newsletter.notOpened', { count: notOpened })}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.md },
  gaugeRow: { flexDirection: 'row', justifyContent: 'space-around' },
  gaugeCol: { alignItems: 'center' },
  gaugeLabel: { ...text.bodySemi, marginTop: space.xs },
  gaugeCaption: { ...text.caption },
  recipientCount: { ...text.body, textAlign: 'center', marginTop: space.md },
  chartTitle: { ...text.bodySemi, marginTop: space.lg, marginBottom: space.sm },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: space.xs },
  legendLabel: { ...text.caption },
});
