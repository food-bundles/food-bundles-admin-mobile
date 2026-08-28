import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/forms/ImageUpload';

/** Create restaurant: name, TIN, email, phone, address, district, image upload. */
export default function CreateRestaurantScreen() {
  useRoleGuard('usersRestaurants');
  const t = useT();
  const [name, setName] = useState('');
  const [tin, setTin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    router.back();
  };

  return (
    <AdminScreen title={t('restaurants.title')}>
      <ScrollView contentContainerStyle={styles.content}>
        <ImageUpload uri={imageUri} onChange={setImageUri} shape="circle" accessibilityLabel={t('restaurants.fieldName')} />
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('restaurants.fieldTin')} value={tin} onChangeText={setTin} />
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label={t('restaurants.fieldPhone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label={t('restaurants.fieldAddress')} value={address} onChangeText={setAddress} />
        <Input label={t('restaurants.fieldDistrict')} value={district} onChangeText={setDistrict} />
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('common.save')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md, alignItems: 'center' },
});
