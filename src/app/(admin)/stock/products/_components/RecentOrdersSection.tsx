import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { hit, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatRelative } from '@/lib/date';
import { useOrdersStore } from '@/stores/ordersStore';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export interface RecentOrdersSectionProps {
  productId: string;
}

/** Collapsible "Recent orders containing this product" — last 5 orders with this productId. */
export function RecentOrdersSection({ productId }: RecentOrdersSectionProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const orders = useOrdersStore((state) => state.orders);
  const [expanded, setExpanded] = useState(false);

  const matching = orders
    .filter((o) => o.items.some((item) => item.productId === productId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const toggle = () => {
    LayoutAnimation.configureNext({ duration: 220, update: { type: LayoutAnimation.Types.easeInEaseOut } });
    setExpanded((prev) => !prev);
  };

  return (
    <View style={[styles.container, { borderColor: colors.hairline }]}>
      <Pressable onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded }} accessibilityLabel={t('products.recentOrdersTitle')} style={styles.header}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('products.recentOrdersTitle')}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>
      {expanded ? (
        matching.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>{t('products.noRecentOrders')}</Text>
        ) : (
          matching.map((order) => {
            const item = order.items.find((i) => i.productId === productId);
            return (
              <Pressable
                key={order.id}
                onPress={() => router.push(`/(admin)/orders/${order.id}`)}
                accessibilityRole="button"
                accessibilityLabel={order.id}
                style={styles.row}
              >
                <Text style={[styles.orderId, { color: colors.leaf }]}>{order.id}</Text>
                <Text style={[styles.detail, { color: colors.body }]} numberOfLines={1}>
                  {order.restaurantName}
                </Text>
                <Text style={[styles.detail, { color: colors.muted }]}>
                  {item ? `${item.qty} × ${formatRwf(item.unitPrice)}` : ''}
                </Text>
                <Text style={[styles.date, { color: colors.muted }]}>{formatRelative(order.createdAt, language, t)}</Text>
              </Pressable>
            );
          })
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, paddingTop: space.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: hit.min },
  title: { ...text.h3 },
  empty: { ...text.body, paddingVertical: space.sm },
  row: { paddingVertical: space.xs, gap: 2 },
  orderId: { ...text.bodySemi },
  detail: { ...text.caption },
  date: { ...text.caption },
});
