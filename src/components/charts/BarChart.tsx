import { View } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { signatureDuration, useTheme, type ColorPalette } from '@/theme';

export interface BarChartDatum {
  x: number;
  y: number;
  [key: string]: unknown;
}

export interface BarChartProps {
  data: BarChartDatum[];
  colorKey?: keyof ColorPalette;
  height?: number;
}

/** Animated vertical bar chart. Bars stagger in, 60ms apart, 600ms rise each. */
export function BarChart({ data, colorKey = 'leaf', height = 200 }: BarChartProps) {
  const { colors } = useTheme();
  const color = colors[colorKey];

  return (
    <View style={{ height }}>
      <CartesianChart data={data} xKey="x" yKeys={['y']}>
        {({ points, chartBounds }) => (
          <Bar
            points={points.y}
            chartBounds={chartBounds}
            color={color}
            roundedCorners={{ topLeft: 4, topRight: 4 }}
            animate={{ type: 'timing', duration: signatureDuration.chartBarRise }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
