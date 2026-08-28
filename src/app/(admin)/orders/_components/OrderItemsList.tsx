import { Image, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import type { OrderItem } from '@/mocks/orderItem';

export interface OrderItemsListProps {
  items: OrderItem[];
}

/** Each row: 48×48 photo + name + qty×unit + subtotal. */
export function OrderItemsList({ items }: OrderItemsListProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('orders.itemsSection')}</Text>
      <Card>
        {items.map((item, index) => (
          <View
            key={item.productId}
            style={[styles.row, index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
          >
            <Image source={{ uri: item.imageUri }} style={styles.photo} />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
              <Text style={[styles.qty, { color: colors.muted }]}>
                {item.qty} × {formatRwf(item.unitPrice)}
              </Text>
            </View>
            <Text style={[styles.subtotal, { color: colors.ink }]}>{formatRwf(item.totalPrice)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm },
  photo: { width: 48, height: 48, borderRadius: 8 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  qty: { ...text.caption, marginTop: 2 },
  subtotal: { ...text.bodySemi },
});
