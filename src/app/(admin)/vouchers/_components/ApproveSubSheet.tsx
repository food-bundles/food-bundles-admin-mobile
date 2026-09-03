import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OtpConfirmSheet } from '@/components/modals/OtpConfirmSheet';
import { TIER_FLOOR_RWF } from '@/lib/creditScoring';
import type { CreditTier } from '@/lib/creditScoring';

export interface ApproveSubSheetProps {
  visible: boolean;
  tier: CreditTier;
  computedLimit: number;
  onClose: () => void;
  onApprove: (amount: number) => void;
}

/** Approve sub-sheet: slider + manual amount input (min=tier floor, max=computed limit), then OTP confirmation. */
export function ApproveSubSheet({ visible, tier, computedLimit, onClose, onApprove }: ApproveSubSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const min = Math.min(TIER_FLOOR_RWF[tier], computedLimit);
  const [amount, setAmount] = useState(computedLimit);
  const [otpVisible, setOtpVisible] = useState(false);

  const handleClose = () => {
    setOtpVisible(false);
    onClose();
  };

  return (
    <>
      <Sheet visible={visible && !otpVisible} height="medium" onClose={handleClose}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers.approveAction')}</Text>
          <Text style={[styles.amountValue, { color: colors.leaf }]}>{formatRwf(amount)}</Text>
          <Slider
            minimumValue={min}
            maximumValue={Math.max(computedLimit, min + 1)}
            step={1000}
            value={amount}
            onValueChange={setAmount}
            minimumTrackTintColor={colors.leaf}
            maximumTrackTintColor={colors.hairline}
            accessibilityLabel={t('vouchers.approveAmountLabel')}
          />
          <Input
            label={t('vouchers.approveAmountLabel')}
            value={String(Math.round(amount))}
            onChangeText={(value) => setAmount(Number(value.replace(/[^0-9]/g, '')) || min)}
            keyboardType="numeric"
          />
          <Button variant="primary" fullWidth onPress={() => setOtpVisible(true)} accessibilityLabel={t('vouchers.approveAction')}>
            {t('vouchers.approve')}
          </Button>
        </View>
      </Sheet>
      <OtpConfirmSheet
        visible={otpVisible}
        title={t('vouchers.approveOtpTitle')}
        message={t('vouchers.approveOtpMessage')}
        onClose={() => setOtpVisible(false)}
        onConfirm={() => {
          onApprove(Math.round(amount));
          handleClose();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, padding: space.lg },
  title: { ...text.h3 },
  amountValue: { ...text.priceLg, textAlign: 'center' },
});
