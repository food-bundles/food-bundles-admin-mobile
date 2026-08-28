import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Market } from '@/mocks/markets';

export interface MarketSheetProps {
  visible: boolean;
  initial?: Market;
  onClose: () => void;
  onSave: (name: string, location: string, district: string) => void;
}

/** Add/edit market form: name, location, district. Local-only, no persistence. */
export function MarketSheet({ visible, initial, onClose, onSave }: MarketSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState(initial?.name ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [district, setDistrict] = useState(initial?.district ?? '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name.trim(), location.trim(), district.trim());
    onClose();
  };

  return (
    <Sheet visible={visible} height="medium" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t(initial ? 'markets.editMarket' : 'markets.addMarket')}</Text>
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('markets.fieldLocation')} value={location} onChangeText={setLocation} />
        <Input label={t('restaurants.fieldDistrict')} value={district} onChangeText={setDistrict} />
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
