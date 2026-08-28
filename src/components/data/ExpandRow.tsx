import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { space, useTheme } from '@/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export interface ExpandRowProps {
  header: React.ReactNode;
  children: React.ReactNode;
  accessibilityLabel: string;
}

/** Accordion row: tapping the header toggles the panel below it. */
export function ExpandRow({ header, children, accessibilityLabel }: ExpandRowProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={[styles.container, { borderColor: colors.hairline }]}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded }}
        style={styles.header}
      >
        {header}
      </Pressable>
      {expanded ? <View style={styles.panel}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1 },
  header: { minHeight: 44, paddingVertical: space.sm },
  panel: { paddingBottom: space.md },
});
