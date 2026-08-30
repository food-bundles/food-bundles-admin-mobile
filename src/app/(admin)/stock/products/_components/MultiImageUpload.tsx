import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

/** Horizontal scroll of up to `maxImages` thumbnails. "+" adds via the OS picker; tap an existing image to remove it. First image is primary. */
export function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const { colors } = useTheme();
  const t = useT();

  const addImage = async () => {
    if (images.length >= maxImages) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]) onChange([...images, result.assets[0].uri]);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.ink }]}>{t('products.photos')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {images.map((uri, index) => (
          <Pressable
            key={uri + index}
            onPress={() => removeImage(index)}
            accessibilityRole="button"
            accessibilityLabel={t('products.removePhoto')}
            style={styles.thumbWrap}
          >
            <Image source={{ uri }} style={styles.thumb} />
            {index === 0 ? (
              <View style={[styles.primaryBadge, { backgroundColor: colors.leaf }]}>
                <Text style={[styles.primaryLabel, { color: colors.paper }]}>{t('products.primaryPhoto')}</Text>
              </View>
            ) : null}
            <View style={[styles.removeDot, { backgroundColor: colors.chili }]}>
              <Ionicons name="close" size={12} color={colors.paper} />
            </View>
          </Pressable>
        ))}
        {images.length < maxImages ? (
          <Pressable
            onPress={addImage}
            accessibilityRole="button"
            accessibilityLabel={t('products.addPhoto')}
            style={[styles.addButton, { borderColor: colors.hairline }]}
          >
            <Ionicons name="add" size={24} color={colors.muted} />
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.xs },
  label: { ...text.label },
  row: { flexDirection: 'row', gap: space.sm },
  thumbWrap: { position: 'relative' },
  thumb: { width: 72, height: 72, borderRadius: radius.sm },
  primaryBadge: { position: 'absolute', bottom: 4, left: 4, right: 4, borderRadius: radius.sm, paddingVertical: 2, alignItems: 'center' },
  primaryLabel: { fontSize: 9, fontWeight: '600' },
  removeDot: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  addButton: { width: 72, height: 72, borderRadius: radius.sm, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
});
