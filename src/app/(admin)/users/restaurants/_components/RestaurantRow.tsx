import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
}

/** Logo circle + name + district + status chip + subscription badge + wallet balance + order count + joined date. */
export function RestaurantRow({ restaurant }: RestaurantRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const orderCount = MOCK_ORDERS.filter((o) => o.restaurantId === restaurant.id).length;

  return (
    <Card onPress={() => router.push(`/(admin)/users/restaurants/${restaurant.id}`)} accessibilityLabel={restaurant.name}>
      <View style={styles.header}>
        <Image source={{ uri: restaurant.imageUri }} style={styles.logo} />
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{restaurant.name}</Text>
          <Text style={[styles.district, { color: colors.muted }]}>{restaurant.district}</Text>
        </View>
        <Badge tone={STATUS_TONE[restaurant.status]} label={t(STATUS_LABEL_KEY[restaurant.status])} />
      </View>
      <View style={styles.footer}>
        {restaurant.subscription ? <Badge tone="leaf" label={restaurant.subscription} /> : null}
        <Text style={[styles.detail, { color: colors.muted }]}>{formatRwf(restaurant.walletBalance)}</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{t('restaurants.orderCount', { count: orderCount })}</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(restaurant.createdAt, language)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  logo: { width: 44, height: 44, borderRadius: 22 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  district: { ...text.caption, marginTop: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm, flexWrap: 'wrap' },
  detail: { ...text.caption },
});
