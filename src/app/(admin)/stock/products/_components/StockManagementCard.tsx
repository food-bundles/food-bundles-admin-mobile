import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useProductsStore } from '@/stores/productsStore';
import type { Product } from '@/mocks/products';

export interface StockManagementCardProps {
  product: Product;
  reorderThreshold: number;
}

/** Set reorder threshold, mark as discontinued, and duplicate this product into a pre-filled create form. */
export function StockManagementCard({ product, reorderThreshold }: StockManagementCardProps) {
  const { colors } = useTheme();
  const t = useT();
  const setOverride = useProductsStore((state) => state.setOverride);
  const duplicateProduct = useProductsStore((state) => state.duplicateProduct);
  const [threshold, setThreshold] = useState(String(reorderThreshold));
  const [saved, setSaved] = useState(false);

  const isDiscontinued = product.status === 'DISCONTINUED';

  const handleSaveThreshold = () => {
    const parsed = Number(threshold);
    if (Number.isFinite(parsed) && parsed >= 0) {
      setOverride(product.id, { reorderThreshold: parsed });
      setSaved(true);
    }
  };

  const handleDuplicate = () => {
    const copy = duplicateProduct(product);
    router.push({ pathname: '/(admin)/stock/products/create', params: { prefillName: copy.name, prefillPrice: String(copy.price) } });
  };

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('products.stockManagement')}</Text>

      <Input label={t('products.reorderThreshold')} value={threshold} onChangeText={setThreshold} keyboardType="numeric" />
      <Button variant="secondary" size="sm" onPress={handleSaveThreshold}>
        {t('common.save')}
      </Button>
      {saved ? <Text style={[styles.saved, { color: colors.ripe }]}>{t('products.thresholdSaved')}</Text> : null}

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: colors.ink }]}>{t('products.markDiscontinued')}</Text>
        <Switch
          value={isDiscontinued}
          onValueChange={(value) => setOverride(product.id, { status: value ? 'DISCONTINUED' : 'ACTIVE' })}
          accessibilityLabel={t('products.markDiscontinued')}
        />
      </View>

      <Button variant="ghost" fullWidth onPress={handleDuplicate}>
        {t('products.duplicateProduct')}
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.sm },
  saved: { ...text.caption, marginTop: space.xs },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: space.md },
  toggleLabel: { ...text.body, flex: 1 },
});
