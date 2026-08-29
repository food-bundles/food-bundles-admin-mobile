import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, text, useTheme } from '@/theme';

export interface PriceChangeBadgeProps {
  pct: number;
}

/**
 * Shared market price-delta pill: ripe green + up arrow for a positive
 * change, chili + down arrow for negative — same pattern used on the
 * dashboard's market summary widget, applied everywhere else a price
 * change is shown (Analysis tab, etc.) instead of a plain text-only Badge.
 */
export function PriceChangeBadge({ pct }: PriceChangeBadgeProps) {
  const { colors } = useTheme();
  const isUp = pct >= 0;
  const color = isUp ? colors.ripe : colors.chili;
  const bg = isUp ? colors.tintRipe : colors.tintChili;

  return (
    <View style={[styles.base, { backgroundColor: bg }]}>
      <Ionicons name={isUp ? 'arrow-up' : 'arrow-down'} size={12} color={color} />
      <Text style={[styles.label, { color }]}>{`${Math.abs(pct).toFixed(1)}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
    alignSelf: 'flex-start',
  },
  label: { ...text.overline },
});
