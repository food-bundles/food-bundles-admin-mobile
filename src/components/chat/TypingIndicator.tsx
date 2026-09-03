import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { radius, space, useTheme } from '@/theme';

const STAGGER_MS = 200;
const CYCLE_MS = 900;

const AnimatedDot = Animated.createAnimatedComponent(View);

/** Three-dot pulse, mirroring AvatarFace's thinking-dots technique. Used while waiting for a simulated reply. */
export function TypingIndicator() {
  const { colors } = useTheme();
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    [dot1, dot2, dot3].forEach((dot, index) => {
      dot.value = withDelay(
        index * STAGGER_MS,
        withRepeat(withSequence(withTiming(1, { duration: CYCLE_MS / 2 }), withTiming(0.3, { duration: CYCLE_MS / 2 })), -1, false),
      );
    });
    const values = [dot1, dot2, dot3];
    return () => values.forEach(cancelAnimation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={[styles.bubble, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <AnimatedDot style={[styles.dot, { backgroundColor: colors.muted }, style1]} />
      <AnimatedDot style={[styles.dot, { backgroundColor: colors.muted }, style2]} />
      <AnimatedDot style={[styles.dot, { backgroundColor: colors.muted }, style3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
