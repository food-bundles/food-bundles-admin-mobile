import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { canAccess, type AccessSection } from '@/lib/roleGuard';

interface DrawerItem {
  labelKey: TranslationKey;
  route: string;
  section: AccessSection;
}

interface DrawerSection {
  titleKey: TranslationKey;
  items: DrawerItem[];
}

const SECTIONS: DrawerSection[] = [
  { titleKey: 'nav.dashboard', items: [{ labelKey: 'nav.dashboard', route: '/(admin)/dashboard', section: 'dashboard' }] },
  { titleKey: 'nav.orders', items: [{ labelKey: 'nav.orders', route: '/(admin)/orders', section: 'orders' }] },
  {
    titleKey: 'nav.users',
    items: [
      { labelKey: 'user.restaurants', route: '/(admin)/users/restaurants', section: 'usersRestaurants' },
      { labelKey: 'user.farmers', route: '/(admin)/users/farmers', section: 'usersFarmers' },
      { labelKey: 'user.affiliators', route: '/(admin)/users/affiliators', section: 'usersAffiliators' },
      { labelKey: 'user.admins', route: '/(admin)/users/admins', section: 'usersAdmins' },
      { labelKey: 'user.lookup', route: '/(admin)/users/lookup', section: 'usersLookup' },
    ],
  },
  {
    titleKey: 'nav.stock',
    items: [
      { labelKey: 'stock.products', route: '/(admin)/stock/products', section: 'stock' },
      { labelKey: 'stock.categories', route: '/(admin)/stock/categories', section: 'stock' },
      { labelKey: 'stock.units', route: '/(admin)/stock/units', section: 'stock' },
      { labelKey: 'stock.fbReports', route: '/(admin)/stock/fb-reports', section: 'stock' },
    ],
  },
  { titleKey: 'nav.markets', items: [{ labelKey: 'market.pricing', route: '/(admin)/markets', section: 'markets' }] },
  { titleKey: 'nav.messages', items: [{ labelKey: 'nav.messages', route: '/(admin)/messages', section: 'operations' }] },
  {
    titleKey: 'section.financial',
    items: [
      { labelKey: 'nav.vouchers', route: '/(admin)/vouchers', section: 'financial' },
      { labelKey: 'nav.deposits', route: '/(admin)/deposits', section: 'financial' },
      { labelKey: 'nav.subscriptions', route: '/(admin)/subscriptions', section: 'financial' },
    ],
  },
  {
    titleKey: 'section.operations',
    items: [
      { labelKey: 'nav.promos', route: '/(admin)/promo-codes', section: 'operations' },
      { labelKey: 'nav.invitations', route: '/(admin)/invitations', section: 'operations' },
      { labelKey: 'nav.newsletter', route: '/(admin)/newsletter', section: 'operations' },
      { labelKey: 'nav.farmerSub', route: '/(admin)/farmer-submissions', section: 'operations' },
      { labelKey: 'nav.contactSub', route: '/(admin)/contact-submissions', section: 'operations' },
    ],
  },
  {
    titleKey: 'nav.settings',
    items: [
      { labelKey: 'settings.authenticator', route: '/(admin)/settings/authenticator', section: 'settings' },
      { labelKey: 'settings.notificationRecipients', route: '/(admin)/settings/notification-recipients', section: 'settings' },
    ],
  },
];

/** Drawer content: role-gated section list. Active item gets a leaf tint. */
export function DrawerNav(props: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const t = useT();
  const role = useAuthStore((state) => state.user?.role);
  const activeRoute = props.state.routes[props.state.index]?.name;

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.paper }}>
      {SECTIONS.map((section) => (
        <View key={section.titleKey} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>{t(section.titleKey)}</Text>
          {section.items.map((item) => {
            const allowed = role ? canAccess(role, item.section) : false;
            const active = activeRoute === item.route;
            return (
              <Pressable
                key={item.route}
                disabled={!allowed}
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={t(item.labelKey)}
                accessibilityState={{ disabled: !allowed, selected: active }}
                style={[styles.item, active && { backgroundColor: colors.tintLeaf }]}
              >
                <Text
                  style={[
                    styles.itemLabel,
                    { color: active ? colors.leaf : allowed ? colors.body : colors.disabledText },
                  ]}
                >
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: space.lg },
  section: { marginBottom: space.md },
  sectionTitle: { ...text.overline, paddingHorizontal: space.lg, marginBottom: space.xs },
  item: {
    minHeight: 44,
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    borderRadius: radius.sm,
    marginHorizontal: space.sm,
  },
  itemLabel: { ...text.body },
});
