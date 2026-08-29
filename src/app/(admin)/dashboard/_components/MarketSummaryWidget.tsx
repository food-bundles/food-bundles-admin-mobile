import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { COMMODITIES, getSeries } from '@/mocks/market-prices';

interface CommodityRow {
  name: string;
  price: number;
  changePct: number;
}

function buildRows(): CommodityRow[] {
  return COMMODITIES.map((commodity) => {
    const series = getSeries(commodity.id, 'mkt-001');
    const days = series?.days ?? [];
    const today = days[days.length - 1]?.close ?? 0;
    const yesterday = days[days.length - 2]?.close ?? today;
    const changePct = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;
    return { name: commodity.name, price: today, changePct: Math.round(changePct * 10) / 10 };
  });
}

/** Compact "Today's market summary": 5 commodities, FoodBundles price + 24h change badge, link to Analysis. */
export function MarketSummaryWidget() {
  const { colors } = useTheme();
  const t = useT();
  const rows = buildRows();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.marketSummaryTitle')}</Text>
      <Card>
        {rows.map((row, index) => {
          const isUp = row.changePct >= 0;
          const colorKey: keyof ColorPalette = isUp ? 'ripe' : 'chili';
          return (
            <View
              key={row.name}
              style={[styles.row, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
            >
              <Text style={[styles.name, { color: colors.ink }]}>{row.name}</Text>
              <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(row.price)}</Text>
              <View style={styles.changeBadge}>
                <Ionicons name={isUp ? 'arrow-up' : 'arrow-down'} size={14} color={colors[colorKey]} />
                <Text style={[styles.changeText, { color: colors[colorKey] }]}>{`${Math.abs(row.changePct)}%`}</Text>
              </View>
            </View>
          );
        })}
        <Text
          style={[styles.link, { color: colors.leaf }]}
          onPress={() => router.push('/(admin)/markets?tab=analysis')}
          accessibilityRole="link"
          accessibilityLabel={t('dashboard.marketSummaryLink')}
        >
          {t('dashboard.marketSummaryLink')}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, gap: space.sm },
  name: { ...text.bodySemi, flex: 1 },
  price: { ...text.bodySemi },
  changeBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 56, justifyContent: 'flex-end' },
  changeText: { ...text.caption },
  link: { ...text.bodySemi, marginTop: space.sm, textAlign: 'right' },
});
