import { View } from 'react-native';
import { CartesianChart, Area } from 'victory-native';
import { LinearGradient, vec } from '@shopify/react-native-skia';
import { signatureDuration, useTheme, type ColorPalette } from '@/theme';

export interface AreaChartDatum {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface AreaChartProps {
  data: AreaChartDatum[];
  colorKey?: keyof ColorPalette;
  height?: number;
}

/** Animated area chart. Draws in over 800ms on mount and on data change. */
export function AreaChart({ data, colorKey = 'leaf', height = 200 }: AreaChartProps) {
  const { colors } = useTheme();
  const color = colors[colorKey];

  return (
    <View style={{ height }}>
      <CartesianChart data={data} xKey="x" yKeys={['y']}>
        {({ points, chartBounds }) => (
          <Area
            points={points.y}
            y0={chartBounds.bottom}
            curveType="natural"
            color={color}
            opacity={0.25}
            animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
          >
            <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[color, `${color}00`]} />
          </Area>
        )}
      </CartesianChart>
    </View>
  );
}
