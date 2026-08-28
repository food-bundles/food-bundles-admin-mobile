import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Affiliator, AffiliatorRole } from '@/mocks/affiliators';

export interface AddAffiliatorSheetProps {
  visible: boolean;
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
  onAdd: (affiliator: Affiliator) => void;
}

/** Quick-add form: name + email, role fixed to STAFF. Appended to local list state only. */
export function AddAffiliatorSheet({ visible, restaurantId, restaurantName, onClose, onAdd }: AddAffiliatorSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    const role: AffiliatorRole = 'STAFF';
    onAdd({
      id: `aff-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: '',
      restaurantId,
      restaurantName,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      imageUri: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    });
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="medium" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('restaurants.addAffiliator')}</Text>
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('common.save')}
        </Button>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  title: { ...text.h2 },
});
