import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

/**
 * Brand-color exception (documented per the design-system skill's precedent for MTN/Airtel logo
 * colors): the FoodBundles app icon/splash mark is a static SVG asset rendered outside any
 * ThemeContext (app icon, splash screen before providers mount), so it uses the leaf/pine brand
 * greens as fixed hex values rather than `useTheme()`. This is the one legitimate exception — no
 * other component in the app may hardcode a hex color.
 */
const BRAND_LEAF = '#17683F';
const BRAND_PINE = '#0E4A2B';

export interface FoodBundlesLogoProps {
  /** Overall square size in logical pixels. */
  size: number;
}

/** Circular FoodBundles mark: leaf-green disc + a stylised leaf/bundle glyph + "FB" monogram. */
export function FoodBundlesLogo({ size }: FoodBundlesLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="FoodBundles logo">
      <Circle cx={60} cy={60} r={60} fill={BRAND_LEAF} />
      <Path
        d="M60 32c14 6 22 18 22 30 0 14-10 24-22 26-12-2-22-12-22-26 0-12 8-24 22-30z"
        fill={BRAND_PINE}
        opacity={0.35}
      />
      <SvgText
        x={60}
        y={72}
        fontSize={34}
        fontWeight="700"
        fontFamily="SpaceGrotesk"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        FB
      </SvgText>
    </Svg>
  );
}

/** Square variant of the mark for contexts (app icon export) that need a non-circular frame. */
export function FoodBundlesIcon({ size }: FoodBundlesLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="FoodBundles icon">
      <Path d="M0 0h120v120H0z" fill={BRAND_LEAF} />
      <Path
        d="M60 26c16 7 25 20 25 34 0 16-11 27-25 30-14-3-25-14-25-30 0-14 9-27 25-34z"
        fill={BRAND_PINE}
        opacity={0.35}
      />
      <SvgText
        x={60}
        y={74}
        fontSize={36}
        fontWeight="700"
        fontFamily="SpaceGrotesk"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        FB
      </SvgText>
    </Svg>
  );
}
