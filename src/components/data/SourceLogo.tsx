import { Image, StyleSheet, Text, View } from 'react-native';
import { font, radius, useTheme } from '@/theme';
import type { DataConsentSource } from '@/lib/creditScoring';

const SOURCE_LOGO_URI: Record<Exclude<DataConsentSource, 'foodbundles'>, string> = {
  rra: 'https://res.cloudinary.com/kapkga1t/image/upload/v1786971393/Screenshot_2026-08-17_145606.png',
  eucl: 'https://res.cloudinary.com/kapkga1t/image/upload/v1787672788/csm_EUCL_Photo-17670_f8bc92a2f6.png',
  kayko: 'https://res.cloudinary.com/kapkga1t/image/upload/v1787672910/kayko.png',
  vubaVuba: 'https://res.cloudinary.com/kapkga1t/image/upload/v1787672939/logow.webp',
  creditBureau: 'https://res.cloudinary.com/kapkga1t/image/upload/v1787673176/crb.svg',
};

export interface SourceLogoProps {
  source: DataConsentSource;
  size?: number;
}

/**
 * 48×48 rounded-square logo tile for one of the 6 data-consent sources.
 * FoodBundles has no external logo URL (it's the app's own always-granted
 * source) — rendered as a leaf-bordered "FB" monogram built in-component,
 * since no app logo asset exists on disk (checked src/assets — icon-only).
 */
export function SourceLogo({ source, size = 48 }: SourceLogoProps) {
  const { colors } = useTheme();
  const isFoodBundles = source === 'foodbundles';

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: colors.paper,
          borderColor: isFoodBundles ? colors.leaf : colors.hairline,
          borderWidth: isFoodBundles ? 2 : 1,
        },
      ]}
    >
      {isFoodBundles ? (
        <Text style={[styles.monogram, { color: colors.leaf, fontSize: size * 0.32 }]}>FB</Text>
      ) : (
        <Image
          source={{ uri: SOURCE_LOGO_URI[source] }}
          style={{ width: size - 12, height: size - 12 }}
          resizeMode="contain"
          accessibilityLabel={`${source} logo`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  monogram: { fontFamily: font.displayBold },
});
