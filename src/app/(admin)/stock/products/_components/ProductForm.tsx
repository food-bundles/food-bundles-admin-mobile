import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/mocks/products';
import { MultiImageUpload } from './MultiImageUpload';

export interface ProductFormValues {
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUris: string[];
}

export interface ProductFormProps {
  initial?: Product;
  initialImages?: string[];
  onSubmit: (values: ProductFormValues) => void;
  submitLabel: string;
}

/** Multi-image upload (up to 5, first is primary) + editable fields, shared by the detail/edit and create screens. */
export function ProductForm({ initial, initialImages, onSubmit, submitLabel }: ProductFormProps) {
  const t = useT();
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [stock, setStock] = useState(String(initial?.stock ?? ''));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [images, setImages] = useState<string[]>(initialImages ?? (initial?.imageUri ? [initial.imageUri] : []));

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      description: description.trim(),
      imageUris: images,
    });
  };

  return (
    <View style={styles.container}>
      <MultiImageUpload images={images} onChange={setImages} />
      <View style={styles.fields}>
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('products.fieldPrice')} value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Input label={t('products.fieldStock')} value={stock} onChangeText={setStock} keyboardType="numeric" />
        <Input label={t('products.fieldDescription')} value={description} onChangeText={setDescription} />
      </View>
      <Button variant="primary" fullWidth onPress={handleSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  fields: { width: '100%', gap: space.md },
});
