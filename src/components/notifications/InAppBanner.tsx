import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { radius, shadow, signatureDuration, space, text, useTheme } from '@/theme';

export interface InAppBannerProps {
  title: string;
  body: string;
  onPress: () => void;
  onDismiss: () => void;
}

/** Root-mounted toast for incoming notifications. Auto-dismisses after 4s, swipe-up dismisses. */
export function InAppBanner({ title, body, onPress, onDismiss }: InAppBannerProps) {
  const { colors } = useTheme();
  const translateY = useSharedValue(-120);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
    const timer = setTimeout(() => {
      translateY.value = withTiming(-120, { duration: 300 });
      setTimeout(onDismiss, 300);
    }, signatureDuration.bannerAutoDismiss);
    return () => clearTimeout(timer);
  }, [onDismiss, translateY]);

  const swipe = Gesture.Pan().onEnd((event) => {
    if (event.translationY < -20) {
      translateY.value = withTiming(-120, { duration: 200 });
      runOnJS(onDismiss)();
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View style={[styles.wrap, shadow.elevated, { backgroundColor: colors.paper }, animatedStyle]}>
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${title}: ${body}`}>
          <View>
            <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
            <Text style={[styles.body, { color: colors.muted }]} numberOfLines={2}>
              {body}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: space.md,
    right: space.md,
    borderRadius: radius.md,
    padding: space.md,
    zIndex: 100,
  },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: 2 },
});
