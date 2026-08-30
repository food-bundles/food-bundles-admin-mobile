import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_PRODUCTS, type Product } from '@/mocks/products';
import { ProductForm, type ProductFormValues } from './_components/ProductForm';
import { PricingCalculator } from './_components/PricingCalculator';

/** Product detail/edit: full-width photo, all fields editable, stock adjustment, pricing calculator. */
export default function ProductDetailScreen() {
  useRoleGuard('stock');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const baseProduct = useMemo(() => MOCK_PRODUCTS.find((p) => p.id === id), [id]);
  const [override, setOverride] = useState<Product | null>(null);
  const product = override ?? baseProduct;

  if (!product) {
    return (
      <AdminScreen title={t('products.title')}>
        <EmptyState icon={null} title={t('products.emptyTitle')} message={t('products.emptyMessage')} />
      </AdminScreen>
    );
  }

  const handleSubmit = (values: ProductFormValues) => {
    setOverride({
      ...product,
      name: values.name,
      price: values.price,
      stock: values.stock,
      description: values.description,
      imageUri: values.imageUri ?? product.imageUri,
    });
  };

  return (
    <AdminScreen title={product.name} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm initial={product} onSubmit={handleSubmit} submitLabel={t('products.adjustStock')} />
        <PricingCalculator costPrice={product.price} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.lg },
});
