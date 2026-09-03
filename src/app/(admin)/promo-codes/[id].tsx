import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePromoCodesStore } from '@/stores/promoCodesStore';
import { PromoCodeForm, type PromoCodeFormValues } from './_components/PromoCodeForm';

/** Edit promo code: same form as create, pre-filled. Persists into promoCodesStore on save. */
export default function PromoCodeDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const codes = usePromoCodesStore((state) => state.codes);
  const updateCode = usePromoCodesStore((state) => state.updateCode);
  const code = useMemo(() => codes.find((c) => c.id === id), [codes, id]);

  if (!code) {
    return (
      <AdminScreen title={t('promoCodes.title')}>
        <EmptyState icon={null} title={t('promoCodes.emptyTitle')} message={t('promoCodes.emptyMessage')} />
      </AdminScreen>
    );
  }

  const handleSubmit = (values: PromoCodeFormValues) => {
    updateCode(code.id, values);
    router.back();
  };

  return (
    <AdminScreen title={t('promoCodes.editTitle')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <PromoCodeForm initial={code} onSubmit={handleSubmit} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
