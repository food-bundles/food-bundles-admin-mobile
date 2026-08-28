import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

export interface FilterChip {
  key: string;
  label: string;
}

export interface FilterBarProps {
  chips: FilterChip[];
  activeKey: string | null;
  onSelect: (key: string) => void;
}

/** Horizontal scrollable chip row for list filtering. */
export function FilterBar({ chips, activeKey, onSelect }: FilterBarProps) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {chips.map((chip) => {
        const active = chip.key === activeKey;
        return (
          <Pressable
            key={chip.key}
            onPress={() => onSelect(chip.key)}
            accessibilityRole="button"
            accessibilityLabel={chip.label}
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              active
                ? { backgroundColor: colors.leaf }
                : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.hairline },
            ]}
          >
            <Text style={[styles.label, { color: active ? colors.paper : colors.body }]}>{chip.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  chip: {
    height: 36,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});
