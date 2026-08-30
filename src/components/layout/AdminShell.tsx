import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';
import { useTheme } from '@/theme';
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
 */
export function AdminShell() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.oat }}>
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
    </View>
  );
}
