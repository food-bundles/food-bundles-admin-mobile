import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

const EYE_RY = 3.4;
const BLINK_INTERVAL_MS = 4000;
const BLINK_MS = 120;
const EYE_SHIFT_INTERVAL_MS = 7000;
const EYE_SHIFT_MS = 400;
const THINKING_INTERVAL_MS = 15000;
const THINKING_STAGGER_MS = 200;
const IDLE_BOB_MS = 3000;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export interface AvatarFaceProps {
  /** Overall diameter of the face artwork in px. */
  size?: number;
}

/**
 * FoodBundles AI assistant face for the bottom-nav centre button: blinking eyes every ~4s, an
 * occasional eye-shift glance every ~7s, a thinking-dots cue every ~15s, and a 3s idle bob loop.
 * Mirrors the animation spec already built for the sibling restaurant app's `AvatarFace` (same
 * timing constants) — rebuilt locally since this admin app has no shared component package with
 * that app.
 */
export function AvatarFace({ size = 32 }: AvatarFaceProps) {
  const eyeScaleY = useSharedValue(1);
  const eyeShiftX = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const bobY = useSharedValue(0);

  useEffect(() => {
    eyeScaleY.value = withRepeat(
      withSequence(
        withDelay(BLINK_INTERVAL_MS, withTiming(0.1, { duration: BLINK_MS })),
        withTiming(1, { duration: BLINK_MS }),
      ),
      -1,
      false,
    );
    eyeShiftX.value = withRepeat(
      withSequence(
        withDelay(EYE_SHIFT_INTERVAL_MS, withTiming(2, { duration: EYE_SHIFT_MS, easing: Easing.inOut(Easing.ease) })),
        withTiming(-2, { duration: EYE_SHIFT_MS, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: EYE_SHIFT_MS, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    [dot1, dot2, dot3].forEach((dot, index) => {
      dot.value = withRepeat(
        withSequence(
          withDelay(THINKING_INTERVAL_MS + index * THINKING_STAGGER_MS, withTiming(1, { duration: THINKING_STAGGER_MS })),
          withTiming(0, { duration: THINKING_STAGGER_MS }),
        ),
        -1,
        false,
      );
    });
    bobY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: IDLE_BOB_MS / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: IDLE_BOB_MS / 2, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    const values = [eyeScaleY, eyeShiftX, dot1, dot2, dot3, bobY];
    return () => values.forEach(cancelAnimation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bodyStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bobY.value }] }));
  const leftEyeProps = useAnimatedProps(() => ({ cx: 16 - 7 + eyeShiftX.value, ry: EYE_RY * eyeScaleY.value }));
  const rightEyeProps = useAnimatedProps(() => ({ cx: 16 + 7 + eyeShiftX.value, ry: EYE_RY * eyeScaleY.value }));
  const dot1Props = useAnimatedProps(() => ({ opacity: dot1.value }));
  const dot2Props = useAnimatedProps(() => ({ opacity: dot2.value }));
  const dot3Props = useAnimatedProps(() => ({ opacity: dot3.value }));

  return (
    <Animated.View style={[{ width: size, height: size }, bodyStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <AnimatedCircle cx={11} cy={7} r={1.1} fill="#FFFFFF" animatedProps={dot1Props} />
        <AnimatedCircle cx={16} cy={6} r={1.1} fill="#FFFFFF" animatedProps={dot2Props} />
        <AnimatedCircle cx={21} cy={7} r={1.1} fill="#FFFFFF" animatedProps={dot3Props} />
        <AnimatedEllipse cy={14} rx={EYE_RY} ry={EYE_RY} fill="#FFFFFF" animatedProps={leftEyeProps} />
        <AnimatedEllipse cy={14} rx={EYE_RY} ry={EYE_RY} fill="#FFFFFF" animatedProps={rightEyeProps} />
        <Path d="M12 21 Q16 24 20 21" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      </Svg>
    </Animated.View>
  );
}
