import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { PriceChangeBadge } from '@/components/ui/PriceChangeBadge';
import { COMMODITIES, getSeries } from '@/mocks/market-prices';

interface CommodityRow {
  name: string;
  price: number;
  changePct: number;
  imageUri: string;
}

/** Exact per-commodity thumbnails specified for the dashboard market summary widget. */
const COMMODITY_IMAGE: Record<string, string> = {
  irishPotatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=72',
  tomatoes: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=72',
  redOnions: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=72',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=72',
  carrots: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=72',
};

function buildRows(): CommodityRow[] {
  return COMMODITIES.map((commodity) => {
    const series = getSeries(commodity.id, 'mkt-001');
    const days = series?.days ?? [];
    const today = days[days.length - 1]?.close ?? 0;
    const yesterday = days[days.length - 2]?.close ?? today;
    const changePct = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;
    return {
      name: commodity.name,
      price: today,
      changePct: Math.round(changePct * 10) / 10,
      imageUri: COMMODITY_IMAGE[commodity.id] ?? '',
    };
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
        {rows.map((row, index) => (
          <View
            key={row.name}
            style={[styles.row, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
          >
            <Image source={{ uri: row.imageUri }} style={styles.thumb} accessibilityLabel={row.name} />
            <Text style={[styles.name, { color: colors.ink }]}>{row.name}</Text>
            <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(row.price)}</Text>
            <PriceChangeBadge pct={row.changePct} />
          </View>
        ))}
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
  thumb: { width: 36, height: 36, borderRadius: radius.sm },
  name: { ...text.bodySemi, flex: 1 },
  price: { ...text.bodySemi },
  link: { ...text.bodySemi, marginTop: space.sm, textAlign: 'right' },
});
