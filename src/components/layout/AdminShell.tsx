import { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, easing, useTheme, lightPalette, darkPalette } from '@/theme';
import { DrawerNav } from './DrawerNav';
import { BottomNavBar } from './BottomNavBar';

const { Navigator } = createDrawerNavigator();

/** Typed Expo-Router-aware Drawer, per Expo Router's official drawer-integration pattern. */
const LayoutDrawer = withLayoutContext(Navigator);

/**
 * Drawer chrome shared by every authenticated admin screen, plus a persistent bottom shortcut
 * bar overlaid on top of it. The drawer stays the primary full navigation surface (per the
 * navigation skill); the bottom bar is a secondary 7-shortcut-plus-AI-avatar overlay that stays
 * visible across every (admin)/ screen, including detail screens within a section. Used directly
 * as (admin)/_layout.tsx's default export; Expo Router renders the matched child route as a
 * screen inside the Navigator.
 *
 * The root background cross-fades between the light/dark `oat` tokens on theme toggle (instead of
 * flashing instantly) since this View persists across every admin screen.
 */
export function AdminShell() {
  const { colors, isDark } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, { duration: duration.overlay, easing: easing.standard });
  }, [isDark, progress]);

  const rootStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [lightPalette.oat, darkPalette.oat]),
  }));

  return (
    <Animated.View style={[{ flex: 1 }, rootStyle]}>
      <LayoutDrawer
        drawerContent={DrawerNav}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          overlayColor: 'rgba(0,0,0,0.4)',
          sceneStyle: { backgroundColor: colors.oat },
        }}
      />
      <BottomNavBar />
    </Animated.View>
  );
}
