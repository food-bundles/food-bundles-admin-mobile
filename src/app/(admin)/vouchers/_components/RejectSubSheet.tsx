import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OtpConfirmSheet } from '@/components/modals/OtpConfirmSheet';

export interface RejectSubSheetProps {
  visible: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

/** Reject sub-sheet: requires a rejection reason, then OTP confirmation before finalizing. */
export function RejectSubSheet({ visible, onClose, onReject }: RejectSubSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [otpVisible, setOtpVisible] = useState(false);

  const handleClose = () => {
    setOtpVisible(false);
    onClose();
  };

  const handleContinue = () => {
    if (!reason.trim()) {
      setError(t('vouchers.rejectionReasonRequired'));
      return;
    }
    setError(undefined);
    setOtpVisible(true);
  };

  return (
    <>
      <Sheet visible={visible && !otpVisible} height="medium" onClose={handleClose}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers.rejectAction')}</Text>
          <Input label={t('vouchers.rejectionReason')} value={reason} onChangeText={setReason} error={error} />
          <Button variant="destructive" fullWidth onPress={handleContinue} accessibilityLabel={t('vouchers.rejectAction')}>
            {t('vouchers.reject')}
          </Button>
        </View>
      </Sheet>
      <OtpConfirmSheet
        visible={otpVisible}
        title={t('vouchers.rejectOtpTitle')}
        message={t('vouchers.rejectOtpMessage')}
        onClose={() => setOtpVisible(false)}
        onConfirm={() => {
          onReject(reason.trim());
          handleClose();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, padding: space.lg },
  title: { ...text.h3 },
});
