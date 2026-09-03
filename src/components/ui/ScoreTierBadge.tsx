import { StyleSheet, Text, View } from 'react-native';
import { radius, text, useTheme, type ColorPalette } from '@/theme';
import type { CreditTier } from '@/lib/creditScoring';

export interface ScoreTierBadgeProps {
  tier: CreditTier;
}

const TIER_BG: Record<CreditTier, keyof ColorPalette> = {
  A: 'tintLeaf',
  B: 'tintRipe',
  C: 'tintMarigold',
  D: 'tintChili',
};

const TIER_TEXT: Record<CreditTier, keyof ColorPalette> = {
  A: 'leaf',
  B: 'tintedGreenText',
  C: 'tintedAmberText',
  D: 'tintedRedText',
};

/**
 * Loan-application score tier badge (A/B/C/D). Distinct from StatusChip/Badge
 * — carries its own tier→colour map since a credit-score tier isn't an
 * order-status or generic Badge tone.
 */
export function ScoreTierBadge({ tier }: ScoreTierBadgeProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.base, { backgroundColor: colors[TIER_BG[tier]] }]}
      accessibilityLabel={`Credit tier ${tier}`}
    >
      <Text style={[styles.label, { color: colors[TIER_TEXT[tier]] }]}>{tier}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.bodySemi },
});
