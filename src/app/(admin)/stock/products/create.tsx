import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { ProductForm } from './_components/ProductForm';

/** Create product: same form as detail/edit, image upload via expo-image-picker. */
export default function CreateProductScreen() {
  useRoleGuard('stock');
  const t = useT();

  return (
    <AdminScreen title={t('products.createTitle')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
