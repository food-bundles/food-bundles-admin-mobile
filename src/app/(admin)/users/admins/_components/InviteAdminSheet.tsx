import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleSelect } from '@/components/forms/RoleSelect';
import type { AdminRole } from '@/types/auth';

export interface InviteAdminSheetProps {
  visible: boolean;
  assignerRole: AdminRole;
  onClose: () => void;
  onInvite: (email: string, role: AdminRole) => void;
}

/** Invite form: email + role select (filtered to what the assigner may grant). Local-only, no real email sent. */
export function InviteAdminSheet({ visible, assignerRole, onClose, onInvite }: InviteAdminSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('ADMIN');

  const handleSubmit = () => {
    if (!email.trim()) return;
    onInvite(email.trim(), role);
    setEmail('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="medium" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('admins.invite')}</Text>
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <RoleSelect value={role} onChange={setRole} assignerRole={assignerRole} />
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('admins.invite')}
        </Button>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  title: { ...text.h2 },
});
