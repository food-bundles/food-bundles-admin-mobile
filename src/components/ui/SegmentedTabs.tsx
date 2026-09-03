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

/**
 * Generic top segmented control, scrollable when items overflow. Used by every tabbed detail/list screen.
 *
 * The bar has a fixed `height: hit.min` (44px) — never `minHeight` alone — so it can never be stretched
 * taller by an ancestor flex container (e.g. a screen body with `flex: 1` and a sibling list that also
 * wants to grow). Each pill is `height: 32` + `alignSelf: 'flex-start'` for the same reason: RN's default
 * `alignItems: 'stretch'` on a flex row would otherwise let the pill balloon to whatever cross-axis space
 * the row is given, regardless of the row's own explicit height.
 */
export function SegmentedTabs<T extends string>({ items, active, onChange }: SegmentedTabsProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.bar, { borderColor: colors.hairline }]}
      contentContainerStyle={styles.row}
    >
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
  bar: { flexGrow: 0, flexShrink: 0, height: hit.min, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  tab: {
    height: 32,
    alignSelf: 'flex-start',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
