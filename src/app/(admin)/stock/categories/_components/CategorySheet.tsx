import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface CategorySheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

/** Add-category form: name only. Local-only, no persistence. */
export function CategorySheet({ visible, onClose, onSave }: CategorySheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="short" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('categories.create')}</Text>
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
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
