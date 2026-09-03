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
import { TeamTwoFactorSection } from './_components/TeamTwoFactorSection';
import { ActivityLogSection } from './_components/ActivityLogSection';

const TEAM_SECTION_ROLE = 'SUPERUSER';

/**
 * 2FA setup (personal): generate TOTP secret, render QR + copyable secret, verify a 6-digit code.
 * Below that, SUPERUSER only: "Team 2FA Status" (per-admin enabled/disabled + Send reminder) and
 * an "Activity log" (last 10 mock verification events, filterable, 7-day success BarChart). The
 * team sections previously would never have rendered at all once the personal setup's `enabled`
 * flag flipped true, since the whole screen early-returned to a bare confirmation message.
 */
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
  const [justEnabled, setJustEnabled] = useState(false);
  const alreadyEnabled = user?.twoFactorEnabled || justEnabled;
  const canSeeTeamSection = user?.role === TEAM_SECTION_ROLE;

  const handleVerify = () => {
    if (!validateTotp(secret, code.trim())) {
      setError(t('settings.otpInvalid'));
      return;
    }
    setError(undefined);
    enableTwoFactor();
    setJustEnabled(true);
  };

  return (
    <AdminScreen title={t('settings.authenticator')}>
      <ScrollView contentContainerStyle={styles.content}>
        {alreadyEnabled ? (
          <View style={styles.confirmWrap}>
            <Text style={[styles.confirmText, { color: colors.ink }]}>{t('settings.enabled')}</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.instruction, { color: colors.muted }]}>{t('settings.scanQr')}</Text>
            <TotpQrCode otpauthUri={otpauthUri} secret={secret} />
            <Text style={[styles.instruction, { color: colors.muted }]}>{t('settings.enterCode')}</Text>
            <Input label={t('auth.otpCode')} value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} error={error} />
            <Button variant="primary" fullWidth onPress={handleVerify}>
              {t('auth.verify')}
            </Button>
          </>
        )}

        {canSeeTeamSection ? (
          <View style={styles.teamSection}>
            <TeamTwoFactorSection />
            <ActivityLogSection />
          </View>
        ) : null}
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  instruction: { ...text.body, marginTop: space.md },
  confirmWrap: { alignItems: 'center', paddingVertical: space.xl },
  confirmText: { ...text.h2, textAlign: 'center' },
  teamSection: { gap: space.md, marginTop: space.lg },
});
