import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, runOnJS } from 'react-native-reanimated';
import { FoodBundlesLogo } from '@/assets/logo';
import { useT } from '@/i18n';

const BRAND_PINE = '#17683F';
const LOGO_FADE_MS = 600;
const HOLD_MS = 1800;
const SCREEN_FADE_MS = 400;

export interface AppSplashProps {
  /** Called once the full enter → hold → exit sequence has finished. */
  onFinish: () => void;
}

/**
 * Branded boot splash: leaf-green screen, logo fades in over 600ms, then after a 1.8s hold the
 * whole screen fades out over 400ms before the navigator is allowed to mount. Uses Reanimated
 * `withTiming` exclusively per the motion skill — never RN's `Animated` API.
 */
export function AppSplash({ onFinish }: AppSplashProps) {
  const t = useT();
  const logoOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: LOGO_FADE_MS, easing: Easing.out(Easing.quad) });
    screenOpacity.value = withDelay(
      HOLD_MS,
      withTiming(0, { duration: SCREEN_FADE_MS, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View style={[styles.root, screenStyle]}>
      <Animated.View style={[styles.center, logoStyle]}>
        <FoodBundlesLogo size={120} />
        <Text style={styles.appName}>{t('splash.appName')}</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: BRAND_PINE, alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  center: { alignItems: 'center', gap: 8 },
  appName: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, fontWeight: '700', color: '#FFFFFF', marginTop: 16 },
  tagline: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: '#FFFFFF', opacity: 0.8 },
});
