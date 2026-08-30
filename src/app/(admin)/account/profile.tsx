import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { useAuthStore } from '@/stores/authStore';

/** My profile: editable avatar/name/phone, read-only email/role, 2FA status, mock save. */
export default function AccountProfileScreen() {
  const t = useT();
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('+250 78 000 0000');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUri ?? null);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  return (
    <AdminScreen title={t('profile.title')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <ImageUpload uri={avatarUri} onChange={setAvatarUri} shape="circle" size={120} accessibilityLabel={t('profile.changePhoto')} />
        <View style={styles.fields}>
          <Input label={t('profile.name')} value={name} onChangeText={setName} />
          <Input label={t('profile.email')} value={user.email} onChangeText={() => undefined} editable={false} />
          <Input label={t('profile.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <View>
            <Text style={[styles.label, { color: colors.ink }]}>{t('profile.role')}</Text>
            <RoleBadge role={user.role} />
          </View>

          <View style={[styles.twoFaCard, { borderColor: colors.hairline }]}>
            <Text style={[text.bodySemi, { color: colors.ink }]}>
              {user.twoFactorEnabled ? t('profile.twoFactorEnabled') : t('profile.twoFactorDisabled')}
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.push('/(admin)/settings/authenticator')}>
              {t('profile.manage2fa')}
            </Button>
          </View>
        </View>

        {saved ? <Text style={[styles.saved, { color: colors.ripe }]}>{t('profile.saved')}</Text> : null}

        <Button variant="primary" fullWidth onPress={() => setSaved(true)}>
          {t('profile.saveChanges')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingVertical: space.lg, alignItems: 'center', gap: space.md },
  fields: { width: '100%', gap: space.md },
  label: { ...text.label, marginBottom: space.xs },
  twoFaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: space.md,
  },
  saved: { ...text.bodySemi },
});
