import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_MARKETS } from '@/mocks/markets';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_MARKET_PRICES } from '@/mocks/market-prices';

/** Record a new price point for one product at one market. Appends to local session state only. */
export default function RecordPriceScreen() {
  const { marketId, productId: initialProductId } = useLocalSearchParams<{ marketId: string; productId?: string }>();
  const { colors } = useTheme();
  const t = useT();
  const market = useMemo(() => MOCK_MARKETS.find((m) => m.id === marketId), [marketId]);
  const trackedProductIds = [...new Set(MOCK_MARKET_PRICES.map((s) => s.productId))];
  const products = MOCK_PRODUCTS.filter((p) => trackedProductIds.includes(p.id));
  const [productId, setProductId] = useState(initialProductId ?? products[0]?.id ?? '');
  const [price, setPrice] = useState('');
  const [saved, setSaved] = useState(false);

  if (!market) {
    return (
      <AdminScreen title={t('markets.title')}>
        <EmptyState icon={null} title={t('markets.title')} message={t('markets.noRecentPrice')} />
      </AdminScreen>
    );
  }

  const productChips: FilterChip[] = products.map((p) => ({ key: p.id, label: p.name }));

  const handleSubmit = () => {
    if (!price.trim()) return;
    setSaved(true);
  };

  return (
    <AdminScreen title={t('markets.recordPrice')}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.marketName, { color: colors.ink }]}>{market.name}</Text>
        <FilterBar chips={productChips} activeKey={productId} onSelect={setProductId} />
        <Input label={t('products.fieldPrice')} value={price} onChangeText={setPrice} keyboardType="numeric" />
        {saved ? <Text style={[styles.saved, { color: colors.ripe }]}>{t('products.saved')}</Text> : null}
        <View style={styles.actions}>
          <Button variant="primary" fullWidth onPress={handleSubmit}>
            {t('common.save')}
          </Button>
          <Button variant="ghost" fullWidth onPress={() => router.back()}>
            {t('common.back')}
          </Button>
        </View>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  marketName: { ...text.h2 },
  saved: { ...text.caption },
  actions: { gap: space.sm, marginTop: space.md },
});
