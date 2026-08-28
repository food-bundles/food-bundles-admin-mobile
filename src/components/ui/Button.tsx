import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, hit, radius, text, useTheme, type ColorPalette } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: string;
  accessibilityLabel?: string;
}

const VARIANT_BG: Record<ButtonVariant, keyof ColorPalette | null> = {
  primary: 'leaf',
  secondary: 'paper',
  destructive: 'chili',
  ghost: null,
};

const VARIANT_TEXT: Record<ButtonVariant, keyof ColorPalette> = {
  primary: 'paper',
  secondary: 'leaf',
  destructive: 'paper',
  ghost: 'leaf',
};

/** Pill-shaped action button. Always ≥44px tall; loading disables press. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  children,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: duration.micro });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: duration.micro });
  }, [scale]);

  const handlePress = useCallback(
    (_event: GestureResponderEvent) => {
      if (!isDisabled) onPress();
    },
    [isDisabled, onPress],
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bgKey = VARIANT_BG[variant];
  const textColor = colors[VARIANT_TEXT[variant]];

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? children}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.base,
          styles[size],
          bgKey ? { backgroundColor: colors[bgKey] } : styles.transparentBg,
          variant === 'secondary' && [styles.bordered, { borderColor: colors.leaf }],
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>{children}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  transparentBg: { backgroundColor: 'transparent' },
  bordered: { borderWidth: 1.5 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: { ...text.bodySemi },
  sm: { minHeight: hit.min },
  md: { minHeight: 48 },
  lg: { minHeight: 56 },
});
