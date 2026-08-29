import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from './Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface OtpConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Shared OTP confirmation step for consequential financial actions (loan
 * approve/reject, consent re-request). Reuses the same mock pattern as
 * `(auth)/two-factor.tsx`: accepts any 6-digit code, since the whole app is
 * mocked with no real OTP backend to validate against.
 */
export function OtpConfirmSheet({ visible, title, message, onClose, onConfirm }: OtpConfirmSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setCode('');
    setError(undefined);
    onClose();
  };

  const handleConfirm = () => {
    if (code.trim().length !== 6) {
      setError(t('auth.otpInvalid'));
      return;
    }
    setCode('');
    setError(undefined);
    onConfirm();
  };

  return (
    <Sheet visible={visible} height="short" onClose={handleClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
        <Input label={t('auth.otpCode')} value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} placeholder="123456" error={error} />
        <Button variant="primary" fullWidth onPress={handleConfirm} accessibilityLabel={t('auth.verify')}>
          {t('auth.verify')}
        </Button>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, padding: space.lg },
  title: { ...text.h3 },
  message: { ...text.body },
});
