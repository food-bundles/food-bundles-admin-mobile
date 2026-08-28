import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import type { Restaurant } from '@/mocks/restaurants';

export interface RestaurantInfoTabProps {
  restaurant: Restaurant;
  onToggleSuspend: () => void;
}

/** Editable info form + Suspend/Reactivate destructive action. Edits are local-only (no persistence). */
export function RestaurantInfoTab({ restaurant, onToggleSuspend }: RestaurantInfoTabProps) {
  const t = useT();
  const [name, setName] = useState(restaurant.name);
  const [email, setEmail] = useState(restaurant.email);
  const [phone, setPhone] = useState(restaurant.phone);
  const [address, setAddress] = useState(restaurant.address);
  const [district, setDistrict] = useState(restaurant.district);
  const [imageUri, setImageUri] = useState<string | null>(restaurant.imageUri);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isActive = restaurant.status === 'ACTIVE';

  return (
    <View style={styles.container}>
      <ImageUpload uri={imageUri} onChange={setImageUri} shape="circle" accessibilityLabel={restaurant.name} />
      <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
      <Input label={t('restaurants.fieldTin')} value={restaurant.tin} onChangeText={() => undefined} editable={false} />
      <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label={t('restaurants.fieldPhone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label={t('restaurants.fieldAddress')} value={address} onChangeText={setAddress} />
      <Input label={t('restaurants.fieldDistrict')} value={district} onChangeText={setDistrict} />

      <Button variant="destructive" fullWidth onPress={() => setConfirmOpen(true)}>
        {t(isActive ? 'restaurants.suspend' : 'restaurants.reactivate')}
      </Button>

      <ConfirmDialog
        visible={confirmOpen}
        title={t(isActive ? 'restaurants.suspend' : 'restaurants.reactivate')}
        message={t(isActive ? 'restaurants.suspendConfirm' : 'restaurants.reactivateConfirm', { name: restaurant.name })}
        confirmLabel={t('common.confirm')}
        variant={isActive ? 'danger' : 'warning'}
        onConfirm={() => {
          setConfirmOpen(false);
          onToggleSuspend();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, alignItems: 'center' },
});
