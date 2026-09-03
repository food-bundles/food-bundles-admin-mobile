import { View } from 'react-native';
import { useT } from '@/i18n';
import { Input } from '@/components/ui/Input';

export interface DeliveryStepProps {
  address: string;
  onChange: (address: string) => void;
}

/** Step 3: delivery address, pre-filled from the restaurant's own address, editable. */
export function DeliveryStep({ address, onChange }: DeliveryStepProps) {
  const t = useT();
  return (
    <View>
      <Input label={t('restaurants.fieldAddress')} value={address} onChangeText={onChange} />
    </View>
  );
}
