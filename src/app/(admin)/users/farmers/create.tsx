import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/forms/ImageUpload';

/** Create farmer: name, email, phone, farm name, farm type, location, image upload. */
export default function CreateFarmerScreen() {
  useRoleGuard('usersFarmers');
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmType, setFarmType] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    router.back();
  };

  return (
    <AdminScreen title={t('farmers.title')}>
      <ScrollView contentContainerStyle={styles.content}>
        <ImageUpload uri={imageUri} onChange={setImageUri} shape="circle" accessibilityLabel={t('restaurants.fieldName')} />
        <View style={styles.fields}>
          <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
          <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label={t('restaurants.fieldPhone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label={t('farmers.fieldFarmName')} value={farmName} onChangeText={setFarmName} />
          <Input label={t('farmers.fieldFarmType')} value={farmType} onChangeText={setFarmType} />
          <Input label={t('farmers.fieldLocation')} value={location} onChangeText={setLocation} />
        </View>
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('common.save')}
        </Button>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md, alignItems: 'center' },
  // See RestaurantInfoTab.tsx: alignItems: 'center' shrink-wraps children with no explicit width.
  fields: { width: '100%', gap: space.md },
});
