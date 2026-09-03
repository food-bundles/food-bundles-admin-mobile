import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate, formatRelative } from '@/lib/date';
import { Badge } from '@/components/ui/Badge';
import { ExpandRow } from '@/components/data/ExpandRow';
import { MOCK_ORDERS } from '@/mocks/orders';
import type { Restaurant, RestaurantStatus } from '@/mocks/restaurants';

const STATUS_TONE = { ACTIVE: 'ripe', SUSPENDED: 'chili', PENDING_VERIFICATION: 'marigold' } as const;
const STATUS_LABEL_KEY: Record<RestaurantStatus, TranslationKey> = {
  ACTIVE: 'restaurants.active',
  SUSPENDED: 'restaurants.suspended',
  PENDING_VERIFICATION: 'restaurants.pendingVerification',
};

export interface RestaurantRowProps {
  restaurant: Restaurant;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Logo circle + name + district + status chip + subscription badge + wallet balance + order count
 * + joined date. Expands to show subscription + wallet balance, last order date + order count,
 * district + TIN, and a "View details" link into the full detail screen.
 */
export function RestaurantRow({ restaurant, expanded, onToggle }: RestaurantRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const restaurantOrders = MOCK_ORDERS.filter((o) => o.restaurantId === restaurant.id);
  const lastOrder = [...restaurantOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <ExpandRow expanded={expanded} onToggle={onToggle} accessibilityLabel={restaurant.name} header={
      <View style={styles.header}>
        <Image source={{ uri: restaurant.imageUri }} style={styles.logo} />
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{restaurant.name}</Text>
          <Text style={[styles.district, { color: colors.muted }]}>{restaurant.district}</Text>
        </View>
        <Badge tone={STATUS_TONE[restaurant.status]} label={t(STATUS_LABEL_KEY[restaurant.status])} />
      </View>
    }>
      <View style={styles.panel}>
        <View style={styles.footer}>
          {restaurant.subscription ? <Badge tone="leaf" label={restaurant.subscription} /> : null}
          <Text style={[styles.detail, { color: colors.muted }]}>{formatRwf(restaurant.walletBalance)}</Text>
        </View>
        <Text style={[styles.detailLine, { color: colors.body }]}>
          {t('restaurants.lastOrderDate')}: {lastOrder ? formatRelative(lastOrder.createdAt, language, t) : '—'} ·{' '}
          {t('restaurants.orderCount', { count: restaurantOrders.length })}
        </Text>
        <Text style={[styles.detailLine, { color: colors.body }]}>
          {restaurant.district} · {restaurant.tin}
        </Text>
        <Text style={[styles.detailLine, { color: colors.muted }]}>{formatDate(restaurant.createdAt, language)}</Text>
        <Pressable
          onPress={() => router.push(`/(admin)/users/restaurants/${restaurant.id}`)}
          accessibilityRole="button"
          accessibilityLabel={t('restaurants.viewDetails')}
        >
          <Text style={[styles.viewLink, { color: colors.leaf }]}>{t('restaurants.viewDetails')}</Text>
        </Pressable>
      </View>
    </ExpandRow>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  logo: { width: 44, height: 44, borderRadius: 22 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  district: { ...text.caption, marginTop: 2 },
  panel: { paddingHorizontal: space.lg, gap: space.xs },
  footer: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  detail: { ...text.caption },
  detailLine: { ...text.body },
  viewLink: { ...text.bodySemi, marginTop: space.xs },
});
