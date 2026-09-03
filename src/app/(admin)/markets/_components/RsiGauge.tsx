import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Gauge } from '@/components/charts/Gauge';

export interface RsiGaugeProps {
  rsi: number;
}

function zoneFor(rsi: number): { colorKey: keyof ColorPalette; hintKey: TranslationKey } {
  if (rsi < 30) return { colorKey: 'chili', hintKey: 'markets.rsiOversold' };
  if (rsi > 70) return { colorKey: 'marigold', hintKey: 'markets.rsiOverbought' };
  return { colorKey: 'muted', hintKey: 'markets.rsiNeutral' };
}

/** RSI (0-100) gauge with colour zones (<30 chili, 30-70 label/muted, >70 marigold) and a plain-language hint. */
export function RsiGauge({ rsi }: RsiGaugeProps) {
  const { colors } = useTheme();
  const t = useT();
  const zone = zoneFor(rsi);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('markets.rsiTitle')}</Text>
      <View style={styles.gaugeWrap}>
        <Gauge value={rsi} max={100} size={120} colorKey={zone.colorKey} />
        <View style={styles.gaugeCenter} pointerEvents="none">
          <Text style={[styles.value, { color: colors.ink }]}>{rsi}</Text>
        </View>
      </View>
      <Text style={[styles.hint, { color: colors.muted }]}>{t(zone.hintKey)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: space.sm },
  title: { ...text.h3 },
  gaugeWrap: { alignItems: 'center', justifyContent: 'center' },
  gaugeCenter: { position: 'absolute', alignItems: 'center' },
  value: { ...text.priceLg },
  hint: { ...text.caption, textAlign: 'center', paddingHorizontal: space.lg },
});
