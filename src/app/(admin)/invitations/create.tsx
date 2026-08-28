import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { useAuthStore } from '@/stores/authStore';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleSelect } from '@/components/forms/RoleSelect';
import type { AdminRole } from '@/types/auth';

/** Send invitation: email + role select. Local-only, no real email sent. */
export default function CreateInvitationScreen() {
  useRoleGuard('usersAdmins');
  const t = useT();
  const assignerRole = useAuthStore((state) => state.user?.role) ?? 'ADMIN';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('ADMIN');

  const handleSubmit = () => {
    if (!email.trim()) return;
    router.back();
  };

  return (
    <AdminScreen title={t('invitations.createTitle')}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <RoleSelect value={role} onChange={setRole} assignerRole={assignerRole} />
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('invitations.create')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
});
