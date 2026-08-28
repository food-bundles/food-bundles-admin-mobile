import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { useAuthStore } from '@/stores/authStore';
import { generateTotpSecret, buildOtpauthUri, validateTotp } from '@/lib/totp';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TotpQrCode } from './_components/TotpQrCode';

/** 2FA setup: generate TOTP secret, render QR + copyable secret, verify a 6-digit code, then confirm. */
export default function AuthenticatorScreen() {
  useRoleGuard('settings');
  const { colors } = useTheme();
  const t = useT();
  const user = useAuthStore((state) => state.user);
  const enableTwoFactor = useAuthStore((state) => state.enableTwoFactor);
  const secret = useMemo(() => generateTotpSecret(), []);
  const otpauthUri = useMemo(() => buildOtpauthUri(secret, user?.email ?? 'admin'), [secret, user?.email]);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);

  const handleVerify = () => {
    if (!validateTotp(secret, code.trim())) {
      setError(t('settings.otpInvalid'));
      return;
    }
    setError(undefined);
    enableTwoFactor();
    setEnabled(true);
  };

  if (enabled) {
    return (
      <AdminScreen title={t('settings.authenticator')}>
        <View style={styles.confirmWrap}>
          <Text style={[styles.confirmText, { color: colors.ink }]}>{t('settings.enabled')}</Text>
        </View>
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={t('settings.authenticator')}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.instruction, { color: colors.muted }]}>{t('settings.scanQr')}</Text>
        <TotpQrCode otpauthUri={otpauthUri} secret={secret} />
        <Text style={[styles.instruction, { color: colors.muted }]}>{t('settings.enterCode')}</Text>
        <Input label={t('auth.otpCode')} value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} error={error} />
        <Button variant="primary" fullWidth onPress={handleVerify}>
          {t('auth.verify')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  instruction: { ...text.body, marginTop: space.md },
  confirmWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  confirmText: { ...text.h2, textAlign: 'center' },
});
