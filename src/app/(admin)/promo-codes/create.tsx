import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { PromoCodeForm } from './_components/PromoCodeForm';

/** Create promo code: same form as edit. */
export default function CreatePromoCodeScreen() {
  const t = useT();

  return (
    <AdminScreen title={t('promoCodes.createTitle')}>
      <ScrollView contentContainerStyle={styles.content}>
        <PromoCodeForm onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
