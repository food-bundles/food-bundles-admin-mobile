import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';
import { useTheme } from '@/theme';
import { DrawerNav } from './DrawerNav';

const { Navigator } = createDrawerNavigator();

/** Typed Expo-Router-aware Drawer, per Expo Router's official drawer-integration pattern. */
const LayoutDrawer = withLayoutContext(Navigator);

/**
 * Drawer chrome shared by every authenticated admin screen. No bottom tab
 * bar — admin nav is drawer-only. Used directly as (admin)/_layout.tsx's
 * default export; Expo Router renders the matched child route as a screen.
 */
export function AdminShell() {
  const { colors } = useTheme();

  return (
    <LayoutDrawer
      drawerContent={DrawerNav}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.4)',
        sceneStyle: { backgroundColor: colors.oat },
      }}
    />
  );
}
