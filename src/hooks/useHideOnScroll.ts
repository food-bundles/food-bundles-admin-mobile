import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { duration, easing } from '@/theme';
import { useScrollNavStore } from '@/stores/scrollNavStore';

/**
 * Tracks scroll-direction state from the shared scrollNavStore (fed by any list screen's
 * onScroll handler) and exposes an animated translateY style: slides fully out of view on
 * scroll-down, slides back in on scroll-up or near-top. Meant to be applied directly to
 * BottomNavBar's wrapping Animated.View.
 */
export function useHideOnScroll(hiddenTranslateY: number) {
  const hidden = useScrollNavStore((state) => state.hidden);

  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(hidden ? hiddenTranslateY : 0, { duration: duration.overlay, easing: easing.standard }),
      },
    ],
  }));
}
