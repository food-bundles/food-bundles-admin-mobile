import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, space, text, useTheme } from '@/theme';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortableHeaderProps {
  label: string;
  direction: SortDirection;
  onPress: () => void;
}

/** Tappable column label with an asc/desc/none arrow indicator. */
export function SortableHeader({ label, direction, onPress }: SortableHeaderProps) {
  const { colors } = useTheme();
  const iconName = direction === 'asc' ? 'arrow-up' : direction === 'desc' ? 'arrow-down' : 'swap-vertical';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.row}
      hitSlop={space.xs}
    >
      <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
      <Ionicons name={iconName} size={14} color={direction ? colors.leaf : colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: hit.min },
  label: { ...text.label },
});
