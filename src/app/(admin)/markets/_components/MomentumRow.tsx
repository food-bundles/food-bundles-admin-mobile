import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import type { MomentumReading } from '@/mocks/market-prices';

const DIRECTION_ICON = { UP: 'arrow-up', FLAT: 'remove', DOWN: 'arrow-down' } as const;
const DIRECTION_COLOR: Record<MomentumReading['direction'], keyof ColorPalette> = {
  UP: 'ripe',
  FLAT: 'muted',
  DOWN: 'chili',
};
const DIRECTION_KEY: Record<MomentumReading['direction'], TranslationKey> = {
  UP: 'markets.momentumUp',
  FLAT: 'markets.momentumFlat',
  DOWN: 'markets.momentumDown',
};

export interface MomentumRowProps {
  momentum: MomentumReading;
}

/** Price momentum: direction arrow + magnitude label. */
export function MomentumRow({ momentum }: MomentumRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const color = colors[DIRECTION_COLOR[momentum.direction]];

  return (
    <View style={styles.row}>
      <Ionicons name={DIRECTION_ICON[momentum.direction]} size={20} color={color} />
      <Text style={[styles.label, { color }]}>{t(DIRECTION_KEY[momentum.direction], { pct: momentum.magnitudePct })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: { ...text.bodySemi },
});
