import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Button } from '@/components/ui/Button';
import { usePromoCodesStore } from '@/stores/promoCodesStore';
import type { PromoCode } from '@/mocks/promo-codes';
import { PromoCodeRow } from './_components/PromoCodeRow';
import { PromoCodeDetailSheet } from './_components/PromoCodeDetailSheet';

/** Promo code list: code, type, value, uses, expiry, status. Tap a row for the detail sheet. Built from promo-codes/page.tsx. */
export default function PromoCodesScreen() {
  useRoleGuard('operations');
  const { colors } = useTheme();
  const t = useT();
  const codes = usePromoCodesStore((state) => state.codes);
  const [detailTarget, setDetailTarget] = useState<PromoCode | null>(null);

  return (
    <AdminScreen title={t('promoCodes.title')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" size="sm" onPress={() => router.push('/(admin)/promo-codes/create')}>
          {t('promoCodes.create')}
        </Button>
      </View>
      <DataList
        data={codes}
        renderItem={({ item }) => <PromoCodeRow code={item} onPress={() => setDetailTarget(item)} />}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={codes.length === 0}
        emptyTitle={t('promoCodes.emptyTitle')}
        emptyMessage={t('promoCodes.emptyMessage')}
        emptyIcon={<Ionicons name="pricetag-outline" size={20} color={colors.leaf} />}
      />
      <PromoCodeDetailSheet code={detailTarget} onClose={() => setDetailTarget(null)} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  actionsWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, alignItems: 'flex-start' },
});
