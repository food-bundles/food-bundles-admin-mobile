import { ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { MOCK_UNITS } from '@/mocks/units';
import type { Product } from '@/mocks/products';
import { ProductForm } from './_components/ProductForm';

/**
 * Create product: same form as detail/edit, image upload via expo-image-picker. Also the target
 * of Section 11's "Duplicate product" action, which passes prefillName/prefillPrice query params
 * — reconstructed here into a full Product-shaped `initial` (ProductForm requires the whole
 * Product type, not a loose partial) using the catalogue's first category/unit as a reasonable
 * default the admin can still change before saving.
 */
export default function CreateProductScreen() {
  useRoleGuard('stock');
  const t = useT();
  const params = useLocalSearchParams<{ prefillName?: string; prefillPrice?: string }>();

  const initial: Product | undefined = params.prefillName
    ? {
        id: '',
        categoryId: MOCK_CATEGORIES[0]?.id ?? '',
        name: params.prefillName,
        unit: MOCK_UNITS[0]?.abbreviation ?? 'kg',
        unitId: MOCK_UNITS[0]?.id ?? '',
        price: Number(params.prefillPrice) || 0,
        stock: 0,
        imageUri: '',
        status: 'ACTIVE',
        description: '',
      }
    : undefined;

  return (
    <AdminScreen title={t('products.createTitle')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm initial={initial} onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
