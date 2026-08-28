import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import type { LoanApplication, VoucherType } from '@/mocks/loans';

export interface LoanApplicationSheetProps {
  application: LoanApplication | null;
  onClose: () => void;
  onApprove: (approvedAmount: number, repaymentDays: number, voucherType: VoucherType) => void;
  onReject: (reason: string) => void;
}

/**
 * Detail sheet: restaurant info + TIN, purpose, approve/reject. The
 * screen-specs skill's "score breakdown / consent sources / questionnaire"
 * sections have no counterpart in voucherService.ts's real fields
 * (grepped — zero matches), so they're not built here; only real fields
 * are shown.
 */
export function LoanApplicationSheet({ application, onClose, onApprove, onReject }: LoanApplicationSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [approvedAmount, setApprovedAmount] = useState('');
  const [repaymentDays, setRepaymentDays] = useState('30');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!application) return null;

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === application.restaurantId);

  const handleApprove = () => {
    const amount = Number(approvedAmount) || application.requestedAmount;
    onApprove(amount, Number(repaymentDays) || 30, 'DISCOUNT_10');
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(rejectionReason.trim());
    onClose();
  };

  return (
    <Sheet visible={application !== null} height="tall" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{application.restaurantName}</Text>
        {restaurant ? <Text style={[styles.detail, { color: colors.muted }]}>TIN: {restaurant.tin}</Text> : null}
        <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(application.requestedAmount)}</Text>
        <Text style={[styles.purposeLabel, { color: colors.muted }]}>{t('vouchers.purpose')}</Text>
        <Text style={[styles.purpose, { color: colors.body }]}>{application.purpose}</Text>

        {application.status === 'PENDING' ? (
          <View style={styles.form}>
            <Input label={t('vouchers.approvedAmount')} value={approvedAmount} onChangeText={setApprovedAmount} keyboardType="numeric" placeholder={String(application.requestedAmount)} />
            <Input label={t('vouchers.repaymentDays')} value={repaymentDays} onChangeText={setRepaymentDays} keyboardType="numeric" />
            <Button variant="primary" fullWidth onPress={handleApprove}>
              {t('vouchers.approve')}
            </Button>
            <Input label={t('vouchers.rejectionReason')} value={rejectionReason} onChangeText={setRejectionReason} />
            <Button variant="destructive" fullWidth onPress={handleReject}>
              {t('vouchers.reject')}
            </Button>
          </View>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  title: { ...text.h2 },
  detail: { ...text.caption },
  amount: { ...text.priceLg, marginTop: space.sm },
  purposeLabel: { ...text.label, marginTop: space.md },
  purpose: { ...text.body },
  form: { gap: space.md, marginTop: space.lg },
});
