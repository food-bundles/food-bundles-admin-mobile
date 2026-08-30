import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES } from '@/mocks/market-prices';

export interface PriceNegotiationCardProps {
  productName: string;
  requestedPrice: number;
  counterOffer: string;
  onChangeCounterOffer: (value: string) => void;
}

/**
 * Farmer's requested price vs. FoodBundles' current price for the same product (looked up from
 * the market-prices mock's FoodBundles series), plus a counter-offer numeric field the admin can
 * use when approving. Falls back to "no current price on record" when the submission's product
 * name doesn't match one of the 5 tracked commodities.
 */
export function PriceNegotiationCard({ productName, requestedPrice, counterOffer, onChangeCounterOffer }: PriceNegotiationCardProps) {
  const { colors } = useTheme();
  const t = useT();
  const commodity = COMMODITIES.find((c) => c.name.toLowerCase() === productName.toLowerCase());
  const foodBundlesSeries = commodity ? MOCK_MARKET_PRICE_SERIES.find((s) => s.commodityId === commodity.id && s.marketId === 'mkt-001') : undefined;
  const currentPrice = foodBundlesSeries?.days.slice(-1)[0]?.close;

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('farmerSubmissions.priceNegotiation')}</Text>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.muted }]}>{t('farmerSubmissions.requestedPrice')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(requestedPrice)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.muted }]}>{t('farmerSubmissions.currentFbPrice')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>
          {currentPrice !== undefined ? formatRwf(currentPrice) : t('farmerSubmissions.noPriceOnRecord')}
        </Text>
      </View>
      <Input
        label={t('farmerSubmissions.counterOffer')}
        value={counterOffer}
        onChangeText={onChangeCounterOffer}
        keyboardType="numeric"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  label: { ...text.body },
  value: { ...text.bodySemi },
});
