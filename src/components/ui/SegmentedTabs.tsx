import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';

export interface SegmentedTabItem<T extends string> {
  key: T;
  label: string;
}

export interface SegmentedTabsProps<T extends string> {
  items: SegmentedTabItem<T>[];
  active: T;
  onChange: (tab: T) => void;
}

/** Generic top segmented control, scrollable when items overflow. Used by every tabbed detail/list screen. */
export function SegmentedTabs<T extends string>({ items, active, onChange }: SegmentedTabsProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(item.key)}
            style={[styles.tab, { backgroundColor: isActive ? colors.leaf : 'transparent' }]}
          >
            <Text style={[text.bodySemi, { color: isActive ? colors.paper : colors.body }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md },
  tab: { minHeight: hit.min, paddingHorizontal: space.md, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
