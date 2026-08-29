import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { signatureDuration, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Gauge } from './Gauge';
import { ScoreTierBadge } from '@/components/ui/ScoreTierBadge';
import type { ComputedScore } from '@/lib/creditScoring';
import { SOURCE_WEIGHT } from '@/lib/creditScoring';

export interface CreditScoreGaugeProps {
  score: ComputedScore;
  anyDenied: boolean;
}

const SOURCE_LABEL_KEY = {
  rra: 'consent.sourceRra',
  eucl: 'consent.sourceEucl',
  vubaVuba: 'consent.sourceVubaVuba',
  kayko: 'consent.sourceKayko',
  foodbundles: 'consent.sourceFoodbundles',
  creditBureau: 'consent.sourceCreditBureau',
} as const;

/**
 * Shared credit-score visual: animated 0–300 arc gauge with the score centred,
 * tier badge below, and staggered per-source contribution bars. Used by both
 * the Loan Application detail sheet (Section 2) and the restaurant "Data &
 * Credit" tab (Section 4) — built once here so neither duplicates the gauge.
 */
export function CreditScoreGauge({ score, anyDenied }: CreditScoreGaugeProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={styles.container}>
      <View style={styles.gaugeWrap}>
        <Gauge value={score.scoreOutOf300} max={300} size={140} colorKey="leaf" />
        <View style={styles.gaugeCenter} pointerEvents="none">
          <Text style={[styles.scoreValue, { color: colors.ink }]}>{score.scoreOutOf300}</Text>
          <Text style={[styles.scoreMax, { color: colors.muted }]}>/300</Text>
        </View>
      </View>
      <View style={styles.tierRow}>
        <ScoreTierBadge tier={score.tier} />
      </View>
      <View style={styles.bars}>
        {score.breakdown.map((entry, index) => (
          <ContributionBar key={entry.source} label={t(SOURCE_LABEL_KEY[entry.source])} weight={SOURCE_WEIGHT[entry.source]} contribution={entry.contribution} index={index} />
        ))}
      </View>
      {anyDenied ? <Text style={[styles.hint, { color: colors.muted }]}>{t('consent.contributeMoreHint')}</Text> : null}
    </View>
  );
}

interface ContributionBarProps {
  label: string;
  weight: number;
  contribution: number;
  index: number;
}

function ContributionBar({ label, weight, contribution, index }: ContributionBarProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const fraction = Math.min(1, contribution / (weight * 300));

  useEffect(() => {
    progress.value = withDelay(index * 60, withTiming(fraction, { duration: signatureDuration.chartBarRise }));
  }, [fraction, index, progress]);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: colors.body }]}>{label}</Text>
      <View style={[styles.barTrack, { backgroundColor: colors.hairline }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: colors.leaf }, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space.sm },
  gaugeWrap: { alignItems: 'center', justifyContent: 'center' },
  gaugeCenter: { position: 'absolute', alignItems: 'center' },
  scoreValue: { ...text.priceLg },
  scoreMax: { ...text.caption },
  tierRow: { marginTop: space.xs },
  bars: { width: '100%', gap: space.sm, marginTop: space.md },
  barRow: { gap: 4 },
  barLabel: { ...text.caption },
  barTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  hint: { ...text.caption, textAlign: 'center', marginTop: space.sm },
});
