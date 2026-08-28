import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, radius, shadow, space, useTheme } from '@/theme';

export type SheetHeight = 'short' | 'medium' | 'tall';

const HEIGHT_FRACTION: Record<SheetHeight, number> = { short: 0.4, medium: 0.6, tall: 0.85 };

export interface SheetProps {
  visible: boolean;
  height?: SheetHeight;
  onClose: () => void;
  children: React.ReactNode;
}

/** Reusable bottom sheet: drag handle, backdrop-tap-to-close, swipe-down-to-close. */
export function Sheet({ visible, height = 'medium', onClose, children }: SheetProps) {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 80) {
        runOnJS(onClose)();
      }
      translateY.value = withTiming(0, { duration: duration.overlay });
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close">
        <View />
      </Pressable>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            shadow.elevated,
            { backgroundColor: colors.paper, height: `${HEIGHT_FRACTION[height] * 100}%` },
            sheetStyle,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.hairline }]} />
          {children}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.lg,
  },
  handle: { width: 40, height: 4, borderRadius: radius.pill, alignSelf: 'center', marginBottom: space.md },
});
