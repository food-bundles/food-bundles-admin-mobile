import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { font, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useRoleGuard } from '@/lib/roleGuard';
import { useAuthStore } from '@/stores/authStore';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_VOUCHERS, type VoucherStatus } from '@/mocks/vouchers';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';

const CAN_MANAGE_ROLES = ['SUPERUSER', 'ADMIN'];

const STATUS_TONE: Record<VoucherStatus, 'ripe' | 'neutral' | 'chili'> = {
  AVAILABLE: 'ripe',
  USED: 'neutral',
  EXPIRED: 'chili',
};

const STATUS_KEY: Record<VoucherStatus, TranslationKey> = {
  AVAILABLE: 'vouchers.statusAvailable',
  USED: 'vouchers.statusUsed',
  EXPIRED: 'vouchers.statusExpired',
};

/** Voucher detail: single-use token model. Restaurant/order links, revoke (AVAILABLE only, ADMIN+). */
export default function VoucherDetailScreen() {
  useRoleGuard('financial');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const role = useAuthStore((state) => state.user?.role);
  const canManage = role ? CAN_MANAGE_ROLES.includes(role) : false;

  const baseVoucher = useMemo(() => MOCK_VOUCHERS.find((v) => v.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<VoucherStatus | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const voucher = baseVoucher && statusOverride ? { ...baseVoucher, status: statusOverride } : baseVoucher;

  if (!voucher) {
    return (
      <AdminScreen title={t('vouchers.title')}>
        <EmptyState icon={null} title={t('vouchers.emptyVouchersTitle')} message={t('vouchers.emptyVouchersMessage')} />
      </AdminScreen>
    );
  }

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === voucher.restaurantId);

  return (
    <AdminScreen title={voucher.restaurantName}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.code, { color: colors.leaf }]}>{voucher.code}</Text>
          <View style={styles.headerRow}>
            <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(voucher.amount)}</Text>
            <Badge tone={STATUS_TONE[voucher.status]} label={t(STATUS_KEY[voucher.status])} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]}>{t('vouchers.issuedOn')}: {formatDate(voucher.issuedAt, language)}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{t('vouchers.expiresOn')}: {formatDate(voucher.expiresAt, language)}</Text>
          {voucher.status === 'USED' && voucher.appliedAt ? (
            <Text style={[styles.detail, { color: colors.muted }]}>{t('vouchers.usedOn')}: {formatDate(voucher.appliedAt, language)}</Text>
          ) : null}
        </Card>

        {restaurant ? (
          <Card onPress={() => router.push(`/(admin)/users/restaurants/${restaurant.id}`)} accessibilityLabel={t('vouchers.viewRestaurant')}>
            <Text style={[styles.link, { color: colors.leaf }]}>{t('vouchers.viewRestaurant')}</Text>
            <Text style={[styles.detail, { color: colors.ink }]}>{voucher.restaurantName}</Text>
          </Card>
        ) : null}

        {voucher.status === 'USED' && voucher.orderId ? (
          <Card onPress={() => router.push(`/(admin)/orders/${voucher.orderId}`)} accessibilityLabel={t('vouchers.viewOrder')}>
            <Text style={[styles.link, { color: colors.leaf }]}>{t('vouchers.viewOrder')}</Text>
            <Text style={[styles.detail, { color: colors.ink }]}>{voucher.orderId}</Text>
          </Card>
        ) : null}

        <Card>
          <Text style={[styles.detail, { color: colors.muted }]}>{t('vouchers.repaymentNotice')}</Text>
        </Card>

        {canManage && voucher.status === 'AVAILABLE' ? (
          <Button variant="destructive" fullWidth onPress={() => setConfirmRevoke(true)} accessibilityLabel={t('vouchers.revoke')}>
            {t('vouchers.revoke')}
          </Button>
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={confirmRevoke}
        title={t('vouchers.revoke')}
        message={t('vouchers.revokeConfirm', { name: voucher.restaurantName })}
        confirmLabel={t('common.confirm')}
        variant="danger"
        onConfirm={() => {
          setStatusOverride('EXPIRED');
          setConfirmRevoke(false);
        }}
        onCancel={() => setConfirmRevoke(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  code: { ...text.h2, fontFamily: font.monospace },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  amount: { ...text.priceLg },
  link: { ...text.bodySemi, marginTop: space.sm },
  detail: { ...text.caption, marginTop: space.xs },
});
