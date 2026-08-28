import { useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { signatureDuration, useTheme, type ColorPalette } from '@/theme';

export interface GaugeProps {
  value: number;
  max: number;
  size?: number;
  colorKey?: keyof ColorPalette;
}

const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const STROKE_WIDTH = 10;

function arcPath(size: number, sweep: number) {
  const path = Skia.Path.Make();
  const inset = STROKE_WIDTH / 2;
  path.addArc(
    { x: inset, y: inset, width: size - inset * 2, height: size - inset * 2 },
    START_ANGLE,
    sweep,
  );
  return path;
}

/** Circular arc gauge, 0 → value/max. Draws in over 1200ms via Reanimated. */
export function Gauge({ value, max, size = 96, colorKey = 'leaf' }: GaugeProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const fraction = Math.min(1, Math.max(0, value / max));

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(fraction, { duration: signatureDuration.gaugeDrawIn });
  }, [fraction, progress]);

  const trackPath = arcPath(size, SWEEP_ANGLE);
  const fillPath = useDerivedValue(() => arcPath(size, SWEEP_ANGLE * progress.value));

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Path path={trackPath} style="stroke" strokeWidth={STROKE_WIDTH} strokeCap="round" color={colors.hairline} />
        <Path
          path={fillPath}
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          color={colors[colorKey]}
        />
      </Canvas>
    </View>
  );
}
