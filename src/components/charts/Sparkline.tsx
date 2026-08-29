import { View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { signatureDuration, useTheme, type ColorPalette } from '@/theme';

export interface SparklineDatum {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface SparklineProps {
  data: SparklineDatum[];
  colorKey?: keyof ColorPalette;
}

/** Compact 60×28 mini line chart for list rows and stat cards. No axes, no labels. Draws in over 800ms on mount and on data change. */
export function Sparkline({ data, colorKey = 'leaf' }: SparklineProps) {
  const { colors } = useTheme();

  return (
    <View style={{ width: 60, height: 28 }}>
      <CartesianChart data={data} xKey="x" yKeys={['y']}>
        {({ points }) => (
          <Line
            points={points.y}
            color={colors[colorKey]}
            strokeWidth={1.5}
            curveType="natural"
            animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
