import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { space, text, useTheme } from '@/theme';
import { submissionRowPhoto } from '@/lib/submissionRowPhoto';

export interface SubmissionHeaderImageProps {
  productName: string;
  farmerName: string;
}

/**
 * Full-width 200px product image with a bottom gradient overlay so the product/farmer name stays
 * legible over any photo. Overlay text uses `colors.paper` (white in light mode, still light in
 * dark mode) rather than a raw hex — it reads correctly against the dark end of the gradient in
 * both themes since the gradient itself is a fixed ink-toned scrim, not theme-dependent.
 */
export function SubmissionHeaderImage({ productName, farmerName }: SubmissionHeaderImageProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={{ uri: submissionRowPhoto(productName) }} style={styles.image} accessibilityLabel={productName} />
      <LinearGradient colors={['transparent', 'rgba(20,34,26,0.75)']} style={styles.gradient}>
        <Text style={[styles.product, { color: colors.paper }]} numberOfLines={1}>
          {productName}
        </Text>
        <Text style={[styles.farmer, { color: colors.paper }]} numberOfLines={1}>
          {farmerName}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 200, width: '100%' },
  image: { width: '100%', height: '100%' },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    justifyContent: 'flex-end',
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
  },
  product: { ...text.h2 },
  farmer: { ...text.body, opacity: 0.9 },
});
