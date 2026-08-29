import { View } from 'react-native';
import { CartesianChart, Candlestick } from 'victory-native';
import { signatureDuration, useTheme } from '@/theme';

export interface OhlcDatum {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  [key: string]: unknown;
}

export interface CandlestickChartProps {
  data: OhlcDatum[];
  height?: number;
}

/** OHLC candlestick chart for per-period market price history. Draws in over 800ms on mount and on data change. */
export function CandlestickChart({ data, height = 200 }: CandlestickChartProps) {
  const { colors } = useTheme();

  return (
    <View style={{ height }}>
      <CartesianChart data={data} xKey="x" yKeys={['open', 'high', 'low', 'close']}>
        {({ points, chartBounds }) => (
          <Candlestick
            openPoints={points.open}
            highPoints={points.high}
            lowPoints={points.low}
            closePoints={points.close}
            chartBounds={chartBounds}
            candleColors={{ positive: colors.ripe, negative: colors.chili }}
            animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
