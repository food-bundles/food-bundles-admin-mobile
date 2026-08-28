import { useCallback } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, radius, shadow, space, useTheme } from '@/theme';

export interface CardProps {
  padded?: boolean;
  elevated?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

/** Base surface for list rows, dashboard tiles, and detail sections. */
export function Card({ padded = true, elevated = false, onPress, accessibilityLabel, style, children }: CardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: duration.micro });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: duration.micro });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const content = (
    <View
      style={[
        styles.base,
        elevated ? shadow.elevated : shadow.card,
        padded && styles.padded,
        { backgroundColor: colors.paper },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md },
  padded: { padding: space.lg },
});
