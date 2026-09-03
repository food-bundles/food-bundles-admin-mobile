import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme';

const BAR_COUNT = 24;
const TICK_MS = 220;

function randomHeights(): number[] {
  return Array.from({ length: BAR_COUNT }, () => 0.15 + Math.random() * 0.85);
}

/** Live-looking waveform: Reanimated-driven bars with randomized jitter (not real audio analysis) for the active-call state. */
export function CallWaveform() {
  const { colors } = useTheme();
  const heights = useSharedValue<number[]>(randomHeights());

  useEffect(() => {
    const interval = setInterval(() => {
      heights.value = randomHeights();
    }, TICK_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.row}>
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <Bar key={index} index={index} heights={heights} color={colors.paper} />
      ))}
    </View>
  );
}

function Bar({ index, heights, color }: { index: number; heights: ReturnType<typeof useSharedValue<number[]>>; color: string }) {
  const style = useAnimatedStyle(() => ({
    height: withTiming(`${heights.value[index] * 100}%`, { duration: TICK_MS }),
  }));
  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 56, width: '100%', justifyContent: 'center' },
  bar: { width: 3, borderRadius: 2, minHeight: 4, opacity: 0.85 },
});
