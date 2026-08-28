import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { MOCK_ADMIN } from '@/mocks/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/** Mock login: validates against MOCK_ADMIN's email, accepts any non-empty password. */
export default function Login() {
  const { colors } = useTheme();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignIn = () => {
    const isValid = email.trim().toLowerCase() === MOCK_ADMIN.email.toLowerCase() && password.length > 0;
    if (!isValid) {
      setError(t('auth.invalidCredentials'));
      return;
    }
    setError(undefined);
    router.push('/(auth)/two-factor');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.oat }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.ink }]}>{t('auth.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{t('auth.subtitle')}</Text>

          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="patrick@food.rw"
            />
            <Input
              label={t('auth.password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error}
            />
          </View>

          <Button variant="primary" fullWidth onPress={handleSignIn}>
            {t('auth.signIn')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: space.xl },
  title: { ...text.display, textAlign: 'center' },
  subtitle: { ...text.body, textAlign: 'center', marginTop: space.sm, marginBottom: space.xxl },
  form: { gap: space.lg, marginBottom: space.xl },
});
