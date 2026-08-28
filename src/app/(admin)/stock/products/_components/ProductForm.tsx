import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/mocks/products';

export interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUri: string | null;
}

export interface ProductFormProps {
  initial?: Product;
  onSubmit: (values: ProductFormValues) => void;
  submitLabel: string;
}

/** Full-width photo + editable fields, shared by the detail/edit and create screens. */
export function ProductForm({ initial, onSubmit, submitLabel }: ProductFormProps) {
  const t = useT();
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [stock, setStock] = useState(String(initial?.stock ?? ''));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [imageUri, setImageUri] = useState<string | null>(initial?.imageUri ?? null);

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      description: description.trim(),
      imageUri,
    });
  };

  return (
    <View style={styles.container}>
      <ImageUpload uri={imageUri} onChange={setImageUri} shape="rounded" size={160} accessibilityLabel={name || t('products.title')} />
      <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
      <Input label={t('products.fieldPrice')} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Input label={t('products.fieldStock')} value={stock} onChangeText={setStock} keyboardType="numeric" />
      <Input label={t('products.fieldDescription')} value={description} onChangeText={setDescription} />
      <Button variant="primary" fullWidth onPress={handleSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, alignItems: 'center' },
});
