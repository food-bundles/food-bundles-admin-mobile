import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme, type ColorPalette } from '@/theme';

export type BadgeTone = 'neutral' | 'leaf' | 'ripe' | 'marigold' | 'chili';

export interface BadgeProps {
  tone: BadgeTone;
  label: string;
}

const TONE_BG: Record<BadgeTone, keyof ColorPalette> = {
  neutral: 'neutral',
  leaf: 'tintLeaf',
  ripe: 'tintRipe',
  marigold: 'tintMarigold',
  chili: 'tintChili',
};

const TONE_TEXT: Record<BadgeTone, keyof ColorPalette> = {
  neutral: 'secondary',
  leaf: 'leaf',
  ripe: 'tintedGreenText',
  marigold: 'tintedAmberText',
  chili: 'tintedRedText',
};

/** Generic pill label. For order status or role, use StatusChip / RoleBadge instead. */
export function Badge({ tone, label }: BadgeProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: colors[TONE_BG[tone]] }]}>
      <Text style={[styles.label, { color: colors[TONE_TEXT[tone]] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
    alignSelf: 'flex-start',
  },
  label: { ...text.overline },
});
