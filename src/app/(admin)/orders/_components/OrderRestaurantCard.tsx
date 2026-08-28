import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import type { Restaurant } from '@/mocks/restaurants';

export interface OrderRestaurantCardProps {
  restaurant: Restaurant;
}

/** Restaurant name, phone, address — tappable through to the restaurant detail screen. */
export function OrderRestaurantCard({ restaurant }: OrderRestaurantCardProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('orders.restaurantCard')}</Text>
      <Card onPress={() => router.push(`/(admin)/users/restaurants/${restaurant.id}`)} accessibilityLabel={restaurant.name}>
        <Text style={[styles.name, { color: colors.ink }]}>{restaurant.name}</Text>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={14} color={colors.muted} />
          <Text style={[styles.detail, { color: colors.muted }]}>{restaurant.phone}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <Text style={[styles.detail, { color: colors.muted }]}>{restaurant.address}</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  name: { ...text.bodySemi, marginBottom: space.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: 2 },
  detail: { ...text.caption },
});
