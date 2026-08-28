import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { radius, useTheme } from '@/theme';

export interface ImageUploadProps {
  uri: string | null;
  onChange: (uri: string) => void;
  shape?: 'circle' | 'rounded';
  size?: number;
  accessibilityLabel: string;
}

/** Shows current image or a placeholder. Tap opens the OS image picker. */
export function ImageUpload({ uri, onChange, shape = 'rounded', size = 96, accessibilityLabel }: ImageUploadProps) {
  const { colors } = useTheme();

  const pick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
  };

  const borderRadius = shape === 'circle' ? size / 2 : radius.lg;

  return (
    <Pressable onPress={pick} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius }} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius, backgroundColor: colors.neutral }]}>
          <Ionicons name="camera-outline" size={size * 0.35} color={colors.muted} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center' },
});
