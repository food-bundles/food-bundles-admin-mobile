import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';

export type RestaurantTabKey = 'info' | 'orders' | 'wallet' | 'affiliators' | 'vouchers';

const TAB_KEY: Record<RestaurantTabKey, TranslationKey> = {
  info: 'restaurants.tabInfo',
  orders: 'restaurants.tabOrders',
  wallet: 'restaurants.tabWallet',
  affiliators: 'restaurants.tabAffiliators',
  vouchers: 'restaurants.tabVouchers',
};

const TABS: RestaurantTabKey[] = ['info', 'orders', 'wallet', 'affiliators', 'vouchers'];

export interface RestaurantTabsProps {
  active: RestaurantTabKey;
  onChange: (tab: RestaurantTabKey) => void;
}

/** Top segmented control: Info | Orders | Wallet | Affiliators | Vouchers. */
export function RestaurantTabs({ active, onChange }: RestaurantTabsProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityLabel={t(TAB_KEY[tab])}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tab)}
            style={[styles.tab, { backgroundColor: isActive ? colors.leaf : 'transparent' }]}
          >
            <Text style={[text.bodySemi, { color: isActive ? colors.paper : colors.body }]}>{t(TAB_KEY[tab])}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md },
  tab: { minHeight: hit.min, paddingHorizontal: space.md, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
