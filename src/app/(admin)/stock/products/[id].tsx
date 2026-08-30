import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useProductsStore } from '@/stores/productsStore';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { ProductForm, type ProductFormValues } from './_components/ProductForm';
import { PricingCalculator } from './_components/PricingCalculator';
import { RecentOrdersSection } from './_components/RecentOrdersSection';
import { ProductPriceComparison } from './_components/ProductPriceComparison';
import { StockManagementCard } from './_components/StockManagementCard';

/**
 * Product detail/edit: multi-image upload, all fields editable, pricing calculator, recent orders
 * containing this product, 7-day price sparkline + market comparison table, and stock management
 * (reorder threshold, discontinue, duplicate).
 */
export default function ProductDetailScreen() {
  useRoleGuard('stock');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const baseProduct = useMemo(() => MOCK_PRODUCTS.find((p) => p.id === id), [id]);
  const setOverride = useProductsStore((state) => state.setOverride);
  const getEffective = useProductsStore((state) => state.getEffective);
  const product = baseProduct ? getEffective(baseProduct) : undefined;

  if (!product) {
    return (
      <AdminScreen title={t('products.title')}>
        <EmptyState icon={null} title={t('products.emptyTitle')} message={t('products.emptyMessage')} />
      </AdminScreen>
    );
  }

  const handleSubmit = (values: ProductFormValues) => {
    setOverride(product.id, {
      name: values.name,
      price: values.price,
      stock: values.stock,
      description: values.description,
      imageUris: values.imageUris,
    });
  };

  return (
    <AdminScreen title={product.name} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm initial={product} initialImages={product.imageUris} onSubmit={handleSubmit} submitLabel={t('products.adjustStock')} />
        <PricingCalculator costPrice={product.price} />
        <ProductPriceComparison productName={product.name} />
        <RecentOrdersSection productId={product.id} />
        <StockManagementCard product={product} reorderThreshold={product.reorderThreshold} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.lg },
});
