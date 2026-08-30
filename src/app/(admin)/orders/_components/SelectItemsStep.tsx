import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Input } from '@/components/ui/Input';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { orderItem, type OrderItem } from '@/mocks/orderItem';

export interface SelectItemsStepProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

/** Step 2: product search + quantity stepper per item, running total. */
export function SelectItemsStep({ items, onChange }: SelectItemsStepProps) {
  const { colors } = useTheme();
  const t = useT();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((p) => p.status === 'ACTIVE' && (!q || p.name.toLowerCase().includes(q)));
  }, [search]);

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      onChange(items.filter((i) => i.productId !== productId));
      return;
    }
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      onChange(items.map((i) => (i.productId === productId ? { ...i, qty, totalPrice: qty * i.unitPrice } : i)));
      return;
    }
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    onChange([...items, orderItem(product.id, product.name, product.imageUri, qty, product.price)]);
  };

  const qtyFor = (productId: string) => items.find((i) => i.productId === productId)?.qty ?? 0;

  return (
    <View style={styles.container}>
      <Input label={t('orderBehalf.searchProduct')} value={search} onChangeText={setSearch} />
      {filtered.map((product) => {
        const qty = qtyFor(product.id);
        return (
          <View key={product.id} style={[styles.row, { borderColor: colors.hairline }]}>
            <Image source={{ uri: product.imageUri }} style={styles.photo} />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={[styles.price, { color: colors.muted }]}>{formatRwf(product.price)}</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQty(product.id, qty - 1)}
                accessibilityRole="button"
                accessibilityLabel={`Decrease ${product.name} quantity`}
                style={styles.stepperButton}
              >
                <Ionicons name="remove" size={18} color={colors.ink} />
              </Pressable>
              <Text style={[styles.qty, { color: colors.ink }]}>{qty}</Text>
              <Pressable
                onPress={() => setQty(product.id, qty + 1)}
                accessibilityRole="button"
                accessibilityLabel={`Increase ${product.name} quantity`}
                style={styles.stepperButton}
              >
                <Ionicons name="add" size={18} color={colors.ink} />
              </Pressable>
            </View>
          </View>
        );
      })}
      <View style={[styles.totalRow, { borderColor: colors.hairline }]}>
        <Text style={[styles.totalLabel, { color: colors.ink }]}>{t('orderBehalf.runningTotal')}</Text>
        <Text style={[styles.totalValue, { color: colors.leaf }]}>{formatRwf(total)}</Text>
      </View>
      {items.length === 0 ? <Text style={[styles.hint, { color: colors.muted }]}>{t('orderBehalf.minOneItem')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs, borderBottomWidth: 1 },
  photo: { width: 40, height: 40, borderRadius: radius.sm },
  textCol: { flex: 1 },
  name: { ...text.body },
  price: { ...text.caption },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  stepperButton: { width: hit.min - 12, height: hit.min - 12, alignItems: 'center', justifyContent: 'center' },
  qty: { ...text.bodySemi, minWidth: 20, textAlign: 'center' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: space.md, borderTopWidth: 1 },
  totalLabel: { ...text.bodySemi },
  totalValue: { ...text.h3 },
  hint: { ...text.caption },
});
