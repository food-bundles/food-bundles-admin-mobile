import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_PROMO_CODES } from '@/mocks/promo-codes';
import { PromoCodeForm } from './_components/PromoCodeForm';

/** Edit promo code: same form as create, pre-filled. */
export default function PromoCodeDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const code = useMemo(() => MOCK_PROMO_CODES.find((c) => c.id === id), [id]);

  if (!code) {
    return (
      <AdminScreen title={t('promoCodes.title')}>
        <EmptyState icon={null} title={t('promoCodes.emptyTitle')} message={t('promoCodes.emptyMessage')} />
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={t('promoCodes.editTitle')}>
      <ScrollView contentContainerStyle={styles.content}>
        <PromoCodeForm initial={code} onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
