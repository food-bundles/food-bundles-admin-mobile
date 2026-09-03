import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { usePromoCodesStore } from '@/stores/promoCodesStore';
import { PromoCodeForm, type PromoCodeFormValues } from './_components/PromoCodeForm';

/** Create promo code: same form as edit. Persists into promoCodesStore on save. */
export default function CreatePromoCodeScreen() {
  useRoleGuard('operations');
  const t = useT();
  const addCode = usePromoCodesStore((state) => state.addCode);

  const handleSubmit = (values: PromoCodeFormValues) => {
    addCode(values);
    router.back();
  };

  return (
    <AdminScreen title={t('promoCodes.createTitle')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <PromoCodeForm onSubmit={handleSubmit} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
