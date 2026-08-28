import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import type { Product, ProductStatus } from '@/mocks/products';

const STATUS_KEY: Record<ProductStatus, TranslationKey> = {
  ACTIVE: 'products.statusActive',
  OUT_OF_STOCK: 'products.statusOutOfStock',
  DISCONTINUED: 'products.statusDiscontinued',
};

function stockColorKey(stock: number): keyof ColorPalette {
  if (stock <= 5) return 'chili';
  if (stock <= 20) return 'marigold';
  return 'ripe';
}

export interface ProductRowProps {
  product: Product;
}

/** 48×48 photo + name + category badge + unit + price + coloured stock level + status chip. */
export function ProductRow({ product }: ProductRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const category = MOCK_CATEGORIES.find((c) => c.id === product.categoryId);

  return (
    <Card onPress={() => router.push(`/(admin)/stock/products/${product.id}`)} accessibilityLabel={product.name}>
      <View style={styles.row}>
        <Image source={{ uri: product.imageUri }} style={styles.photo} />
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{product.name}</Text>
          <View style={styles.metaRow}>
            {category ? <Badge tone="leaf" label={category.name} /> : null}
            <Text style={[styles.unit, { color: colors.muted }]}>{product.unit}</Text>
          </View>
        </View>
        <View style={styles.trailingCol}>
          <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(product.price)}</Text>
          <Text style={[styles.stock, { color: colors[stockColorKey(product.stock)] }]}>
            {t('products.stockLevel', { count: product.stock })}
          </Text>
          <Badge tone="neutral" label={t(STATUS_KEY[product.status])} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  photo: { width: 48, height: 48, borderRadius: 8 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.xs },
  unit: { ...text.caption },
  trailingCol: { alignItems: 'flex-end', gap: space.xs },
  price: { ...text.bodySemi },
  stock: { ...text.caption },
});
