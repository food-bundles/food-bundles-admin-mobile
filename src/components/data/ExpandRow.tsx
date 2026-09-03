import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { space, useTheme } from '@/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export interface ExpandRowProps {
  header: React.ReactNode;
  children: React.ReactNode;
  accessibilityLabel: string;
  /** Controlled from the parent list so only one row can be expanded at a time. */
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Accordion row: tapping the header toggles the panel below it. Deliberately controlled (not
 * internal state) so a parent list screen can enforce "only one row expanded at a time" per the
 * motion skill's row-expand spec. Animates via LayoutAnimation.easeInEaseOut, 220ms.
 */
export function ExpandRow({ header, children, accessibilityLabel, expanded, onToggle }: ExpandRowProps) {
  const { colors } = useTheme();

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
    });
    onToggle();
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
