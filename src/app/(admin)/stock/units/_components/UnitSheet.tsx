import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface UnitSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, abbreviation: string) => void;
}

/** Add-unit form: name + abbreviation. Local-only, no persistence. */
export function UnitSheet({ visible, onClose, onSave }: UnitSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !abbreviation.trim()) return;
    onSave(name.trim(), abbreviation.trim());
    setName('');
    setAbbreviation('');
    onClose();
  };

  return (
    <Sheet visible={visible} height="short" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('units.create')}</Text>
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('units.fieldAbbreviation')} value={abbreviation} onChangeText={setAbbreviation} />
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
