import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { Card } from './Card';

export type StatCardTone = 'ripe' | 'chili' | 'marigold';

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  /** Overrides the default "leading minus = chili" delta colour rule — for counts where any nonzero value is itself the alert (e.g. pending items). */
  deltaTone?: StatCardTone;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const TONE_COLOR: Record<StatCardTone, keyof ColorPalette> = {
  ripe: 'ripe',
  chili: 'chili',
  marigold: 'marigold',
};

/** Dashboard / list-header metric tile. 2-column grid on phone. */
export function StatCard({ label, value, delta, deltaTone, icon, onPress }: StatCardProps) {
  const { colors } = useTheme();
  const tone: StatCardTone = deltaTone ?? (delta?.trim().startsWith('-') ? 'chili' : 'ripe');

  return (
    <Card onPress={onPress} accessibilityLabel={onPress ? `${label}: ${value}` : undefined}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
      {delta ? <Text style={[styles.delta, { color: colors[TONE_COLOR[tone]] }]}>{delta}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...text.label },
  value: { ...text.priceLg, marginTop: space.xs },
  delta: { ...text.caption, marginTop: space.xs },
});
