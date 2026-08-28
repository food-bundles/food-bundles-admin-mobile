import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';

export interface PricingCalculatorProps {
  costPrice: number;
}

const MARKUPS = [10, 20, 30, 50];

/** Shows margin (RWF and suggested price) at a fixed set of markup percentages. */
export function PricingCalculator({ costPrice }: PricingCalculatorProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('products.pricingCalculator')}</Text>
      <Card>
        {MARKUPS.map((markup, index) => {
          const suggestedPrice = costPrice * (1 + markup / 100);
          const margin = suggestedPrice - costPrice;
          return (
            <View
              key={markup}
              style={[styles.row, index < MARKUPS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            >
              <Text style={[styles.label, { color: colors.muted }]}>{t('products.marginAtMarkup', { markup })}</Text>
              <View style={styles.valueCol}>
                <Text style={[styles.suggested, { color: colors.ink }]}>{formatRwf(suggestedPrice)}</Text>
                <Text style={[styles.margin, { color: colors.ripe }]}>+{formatRwf(margin)}</Text>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  title: { ...text.h3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: space.sm },
  label: { ...text.body, flex: 1 },
  valueCol: { alignItems: 'flex-end' },
  suggested: { ...text.bodySemi },
  margin: { ...text.caption },
});
