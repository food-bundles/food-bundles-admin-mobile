import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { duration, easing } from '@/theme';

const STAGGER_STEP_MS = 60;
const RISE_PX = 10;

export interface StaggerInProps {
  /** Position within the staggered group — each subsequent index enters 60ms later. */
  index: number;
  children: React.ReactNode;
}

/**
 * Fade + rise entrance for a grid/list of cards, staggered by index (60ms apart, matching the
 * chart-bar stagger constant already used elsewhere). Uses the app's own duration/easing tokens —
 * no bespoke timing invented for this.
 */
export function StaggerIn({ index, children }: StaggerInProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(index * STAGGER_STEP_MS, withTiming(1, { duration: duration.overlay, easing: easing.enter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * RISE_PX }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
