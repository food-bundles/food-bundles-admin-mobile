import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { ProductForm } from './_components/ProductForm';

/** Create product: same form as detail/edit, image upload via expo-image-picker. */
export default function CreateProductScreen() {
  const t = useT();

  return (
    <AdminScreen title={t('products.createTitle')}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProductForm onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
