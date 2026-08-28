import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { generateId } from '@/lib/id';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { PromoCode, PromoType } from '@/mocks/promo-codes';

export interface PromoCodeFormValues {
  code: string;
  type: PromoType;
  value: number;
  minOrder: number;
  maxUses: number;
}

export interface PromoCodeFormProps {
  initial?: PromoCode;
  onSubmit: (values: PromoCodeFormValues) => void;
  submitLabel: string;
}

/** Code (with auto-generate), type select, value, min order, max uses. Restaurant inclusion/exclusion is out of scope for this phase (no bulk restaurant picker exists yet). */
export function PromoCodeForm({ initial, onSubmit, submitLabel }: PromoCodeFormProps) {
  const t = useT();
  const [code, setCode] = useState(initial?.code ?? '');
  const [type, setType] = useState<PromoType>(initial?.type ?? 'PERCENT');
  const [value, setValue] = useState(String(initial?.value ?? ''));
  const [minOrder, setMinOrder] = useState(String(initial?.minOrder ?? ''));
  const [maxUses, setMaxUses] = useState(String(initial?.maxUses ?? ''));

  const handleGenerate = () => setCode(generateId('PROMO').toUpperCase());

  const handleSubmit = () => {
    onSubmit({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value) || 0,
      minOrder: Number(minOrder) || 0,
      maxUses: Number(maxUses) || 0,
    });
  };

  return (
    <View style={styles.container}>
      <Input label={t('promoCodes.fieldCode')} value={code} onChangeText={setCode} rightSlot={<Button variant="ghost" size="sm" onPress={handleGenerate}>{t('promoCodes.generateCode')}</Button>} />
      <View style={styles.typeRow}>
        <Button variant={type === 'PERCENT' ? 'primary' : 'secondary'} size="sm" onPress={() => setType('PERCENT')}>
          {t('promoCodes.typePercent')}
        </Button>
        <Button variant={type === 'FIXED' ? 'primary' : 'secondary'} size="sm" onPress={() => setType('FIXED')}>
          {t('promoCodes.typeFixed')}
        </Button>
      </View>
      <Input label={t('promoCodes.fieldValue')} value={value} onChangeText={setValue} keyboardType="numeric" />
      <Input label={t('promoCodes.fieldMinOrder')} value={minOrder} onChangeText={setMinOrder} keyboardType="numeric" />
      <Input label={t('promoCodes.fieldMaxUses')} value={maxUses} onChangeText={setMaxUses} keyboardType="numeric" />
      <Button variant="primary" fullWidth onPress={handleSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  typeRow: { flexDirection: 'row', gap: space.sm },
});
