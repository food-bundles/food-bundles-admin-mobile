import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { Sheet } from './Sheet';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
}

export interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  items: ActionMenuItem[];
}

/** Context menu presented as a bottom sheet. */
export function ActionMenu({ visible, onClose, items }: ActionMenuProps) {
  const { colors } = useTheme();

  const handlePress = (item: ActionMenuItem) => {
    onClose();
    item.onPress();
  };

  return (
    <Sheet visible={visible} height="short" onClose={onClose}>
      <View>
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => handlePress(item)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={styles.row}
          >
            {item.icon}
            <Text style={[styles.label, { color: item.destructive ? colors.chili : colors.ink }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: hit.min },
  label: { ...text.body },
});
