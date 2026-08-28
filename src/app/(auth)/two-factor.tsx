import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hit, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { MOCK_ADMIN } from '@/mocks/auth';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/** Mock 2FA challenge: accepts any 6-digit code, then signs in as MOCK_ADMIN. */
export default function TwoFactor() {
  const { colors } = useTheme();
  const t = useT();
  const signIn = useAuthStore((state) => state.signIn);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleVerify = () => {
    if (code.trim().length !== 6) {
      setError(t('auth.otpInvalid'));
      return;
    }
    setError(undefined);
    signIn(MOCK_ADMIN);
    router.replace('/(admin)/dashboard');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.oat }]}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.goBack')}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color={colors.ink} />
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('auth.otpTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{t('auth.otpSubtitle')}</Text>

        <View style={styles.form}>
          <Input
            label={t('auth.otpCode')}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="123456"
            error={error}
          />
        </View>

        <Button variant="primary" fullWidth onPress={handleVerify}>
          {t('auth.verify')}
        </Button>

        <View style={styles.backLinkWrap}>
          <Button variant="ghost" onPress={() => router.back()}>
            {t('auth.backToLogin')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center', marginLeft: space.sm },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: space.xl },
  title: { ...text.h1, textAlign: 'center' },
  subtitle: { ...text.body, textAlign: 'center', marginTop: space.sm, marginBottom: space.xxl },
  form: { gap: space.lg, marginBottom: space.xl },
  backLinkWrap: { marginTop: space.md, alignItems: 'center' },
});
