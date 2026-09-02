import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, space, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { AvatarTabButton } from '@/components/navigation/AvatarTabButton';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';

interface NavItem {
  key: string;
  labelKey: TranslationKey;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  matchPrefix: string;
}

const LEFT_ITEMS: NavItem[] = [
  { key: 'overview', labelKey: 'tab.overview', route: '/(admin)/dashboard', icon: 'grid-outline', activeIcon: 'grid', matchPrefix: '/dashboard' },
  { key: 'orders', labelKey: 'tab.orders', route: '/(admin)/orders', icon: 'receipt-outline', activeIcon: 'receipt', matchPrefix: '/orders' },
  { key: 'users', labelKey: 'tab.users', route: '/(admin)/users/restaurants', icon: 'people-outline', activeIcon: 'people', matchPrefix: '/users' },
];

const RIGHT_ITEMS: NavItem[] = [
  { key: 'stock', labelKey: 'tab.stock', route: '/(admin)/stock/products', icon: 'cube-outline', activeIcon: 'cube', matchPrefix: '/stock' },
  { key: 'markets', labelKey: 'tab.markets', route: '/(admin)/markets', icon: 'trending-up-outline', activeIcon: 'trending-up', matchPrefix: '/markets' },
  { key: 'reports', labelKey: 'tab.reports', route: '/(admin)/reports', icon: 'bar-chart-outline', activeIcon: 'bar-chart', matchPrefix: '/reports' },
];

const ACCOUNT_ITEM: NavItem = {
  key: 'account',
  labelKey: 'tab.account',
  route: '/(admin)/account/profile',
  icon: 'person-circle-outline',
  activeIcon: 'person-circle',
  matchPrefix: '/account',
};

/** Full-focus routes (auth, splash) never show the bottom bar; AdminShell mounts this everywhere else. */
export const BOTTOM_NAV_HEIGHT = 60;

function TabButton({ item, active }: { item: NavItem; active: boolean }) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <Pressable
      onPress={() => router.push(item.route as never)}
      accessibilityRole="button"
      accessibilityLabel={t(item.labelKey)}
      accessibilityState={{ selected: active }}
      style={styles.item}
    >
      <Ionicons name={active ? item.activeIcon : item.icon} size={22} color={active ? colors.leaf : colors.muted} />
      <Text style={[styles.label, { color: active ? colors.leaf : colors.muted }]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
}

/**
 * Persistent bottom shortcut bar overlaying every admin screen: 3 shortcuts, a raised centre AI
 * avatar button, 3 more shortcuts, plus the Account tab (8 items total). This is a secondary
 * overlay — the drawer remains the primary full navigation surface, per the navigation skill.
 * Hidden only on full-focus screens (login, 2FA, splash), which live outside the (admin)/ group
 * this component is mounted in, so no extra visibility logic is needed here.
 */
export function BottomNavBar() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const barHeight = BOTTOM_NAV_HEIGHT + insets.bottom;
  const hideStyle = useHideOnScroll(barHeight);

  const isActive = (item: NavItem) => pathname.includes(item.matchPrefix);

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: colors.paper, borderColor: colors.hairline, height: barHeight, paddingBottom: insets.bottom },
        hideStyle,
      ]}
    >
      {LEFT_ITEMS.map((item) => (
        <TabButton key={item.key} item={item} active={isActive(item)} />
      ))}
      <AvatarTabButton />
      {RIGHT_ITEMS.map((item) => (
        <TabButton key={item.key} item={item} active={isActive(item)} />
      ))}
      <TabButton item={ACCOUNT_ITEM} active={isActive(ACCOUNT_ITEM)} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: space.xs,
  },
  item: { flex: 1, minHeight: hit.min, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 10 },
});
