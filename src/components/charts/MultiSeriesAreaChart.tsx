import { Fragment } from 'react';
import { View } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';
import { DashPathEffect, LinearGradient, vec } from '@shopify/react-native-skia';
import { signatureDuration, useTheme, type ColorPalette } from '@/theme';

export interface MultiSeriesDatum {
  x: number;
  [seriesKey: string]: number;
}

export interface MultiSeriesSpec {
  key: string;
  colorKey: keyof ColorPalette;
  dashed?: boolean;
}

export interface MultiSeriesAreaChartProps {
  data: MultiSeriesDatum[];
  series: MultiSeriesSpec[];
  /** The series key rendered as a filled area (the "hero" series); every other series draws as a line only. */
  heroKey: string;
  height?: number;
}

/**
 * Real overlaid multi-series chart: one filled hero area (FoodBundles) plus
 * every other market as its own coloured line, solid or dashed, all sharing
 * one x/y scale. Replaces the earlier single-series AreaChart + legend-only
 * "overlay" on the Markets Analysis tab (the Phase-15 deferred gap).
 * Draws in over 800ms on mount and on data change.
 */
export function MultiSeriesAreaChart({ data, series, heroKey, height = 220 }: MultiSeriesAreaChartProps) {
  const { colors } = useTheme();
  const yKeys = series.map((s) => s.key);

  return (
    <View style={{ height }}>
      <CartesianChart data={data} xKey="x" yKeys={yKeys}>
        {({ points, chartBounds }) => (
          <>
            {series.map((s) => {
              const color = colors[s.colorKey];
              const seriesPoints = points[s.key];
              if (s.key === heroKey) {
                return (
                  <Fragment key={s.key}>
                    <Area
                      points={seriesPoints}
                      y0={chartBounds.bottom}
                      curveType="natural"
                      color={color}
                      opacity={0.2}
                      animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
                    >
                      <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[color, `${color}00`]} />
                    </Area>
                    <Line
                      points={seriesPoints}
                      curveType="natural"
                      color={color}
                      strokeWidth={2}
                      animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
                    />
                  </Fragment>
                );
              }
              return (
                <Line
                  key={s.key}
                  points={seriesPoints}
                  curveType="natural"
                  color={color}
                  strokeWidth={2}
                  animate={{ type: 'timing', duration: signatureDuration.chartDrawIn }}
                >
                  {s.dashed ? <DashPathEffect intervals={[6, 5]} /> : null}
                </Line>
              );
            })}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
