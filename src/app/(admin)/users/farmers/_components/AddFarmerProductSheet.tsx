import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface AddFarmerProductSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (productName: string) => void;
}

/** Quick-add form: product name only. Appended to local list state only. */
export function AddFarmerProductSheet({ visible, onClose, onAdd }: AddFarmerProductSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="short" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('farmers.addProduct')}</Text>
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
