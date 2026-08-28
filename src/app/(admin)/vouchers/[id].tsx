import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
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
import { MOCK_ADMINS } from '@/mocks/admins';
import { AssignTraderSheet } from './_components/AssignTraderSheet';

const CAN_MANAGE_ROLES = ['SUPERUSER', 'ADMIN'];

/** Voucher detail: real credit-line model. Assign trader + deactivate (ADMIN+). */
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
  const [assignedTraderId, setAssignedTraderId] = useState<string | null>(null);
  const [traderSheetOpen, setTraderSheetOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const voucher = baseVoucher && statusOverride ? { ...baseVoucher, status: statusOverride } : baseVoucher;

  if (!voucher) {
    return (
      <AdminScreen title={t('vouchers.title')}>
        <EmptyState icon={null} title={t('vouchers.emptyVouchersTitle')} message={t('vouchers.emptyVouchersMessage')} />
      </AdminScreen>
    );
  }

  const trader = assignedTraderId ? MOCK_ADMINS.find((a) => a.id === assignedTraderId) : null;

  return (
    <AdminScreen title={voucher.restaurantName}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.headerRow}>
            <Text style={[styles.type, { color: colors.ink }]}>{voucher.voucherType.replace('_', ' ')}</Text>
            <Badge tone={voucher.status === 'ACTIVE' ? 'leaf' : 'chili'} label={voucher.status} />
          </View>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('vouchers.creditLimit')}: {formatRwf(voucher.creditLimit)}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('vouchers.outstandingBalance')}: {formatRwf(voucher.outstandingBalance)}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('vouchers.repaymentDays')}: {voucher.repaymentDays}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(voucher.expiryDate, language)}</Text>
        </Card>

        {trader ? (
          <Card>
            <Text style={[styles.detail, { color: colors.muted }]}>{t('vouchers.assignTrader')}</Text>
            <Text style={[styles.type, { color: colors.ink }]}>{trader.name}</Text>
          </Card>
        ) : null}

        {canManage ? (
          <View style={styles.actions}>
            <Button variant="secondary" fullWidth onPress={() => setTraderSheetOpen(true)}>
              {t('vouchers.assignTrader')}
            </Button>
            {voucher.status !== 'DEACTIVATED' ? (
              <Button variant="destructive" fullWidth onPress={() => setConfirmClose(true)}>
                {t('vouchers.closeVoucher')}
              </Button>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <AssignTraderSheet visible={traderSheetOpen} onClose={() => setTraderSheetOpen(false)} onSelect={setAssignedTraderId} />
      <ConfirmDialog
        visible={confirmClose}
        title={t('vouchers.closeVoucher')}
        message={t('vouchers.closeConfirm', { name: voucher.restaurantName })}
        confirmLabel={t('common.confirm')}
        variant="danger"
        onConfirm={() => {
          setStatusOverride('DEACTIVATED');
          setConfirmClose(false);
        }}
        onCancel={() => setConfirmClose(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  type: { ...text.h3 },
  detail: { ...text.caption, marginTop: space.xs },
  actions: { gap: space.sm, marginTop: space.md },
});
