import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { StaggerIn } from '@/components/ui/StaggerIn';
import { allEffectiveProducts } from '@/stores/productsStore';

const MAX_ROWS = 4;

/**
 * Dashboard "Low stock" tile: count + short list of products below their
 * reorder threshold, reading the same `productsStore.isLowStock`/
 * `reorderThreshold` mechanism the F&B Stock Movement report already
 * consumes. Tapping the tile or its link navigates to the products list
 * (no query-param filter exists on that screen to deep-link into).
 */
export function LowStockWidget() {
  const { colors } = useTheme();
  const t = useT();
  const lowStock = allEffectiveProducts()
    .filter((p) => p.stock < p.reorderThreshold)
    .sort((a, b) => a.stock - b.stock);
  const rows = lowStock.slice(0, MAX_ROWS);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.lowStockTitle')}</Text>
      <Card>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle" size={20} color={lowStock.length > 0 ? colors.chili : colors.leaf} />
          <Text style={[styles.count, { color: lowStock.length > 0 ? colors.chili : colors.ink }]}>
            {lowStock.length > 0 ? t('dashboard.lowStockCount', { count: lowStock.length }) : t('dashboard.lowStockNone')}
          </Text>
        </View>
        {rows.map((product, index) => (
          <StaggerIn key={product.id} index={index}>
            <View style={[styles.row, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}>
              <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={[styles.stock, { color: colors.chili }]}>{t('dashboard.lowStockUnitsLeft', { stock: product.stock })}</Text>
            </View>
          </StaggerIn>
        ))}
        {lowStock.length > 0 ? (
          <Text
            style={[styles.link, { color: colors.leaf }]}
            onPress={() => router.push('/(admin)/stock/products')}
            accessibilityRole="link"
            accessibilityLabel={t('dashboard.lowStockLink')}
          >
            {t('dashboard.lowStockLink')}
          </Text>
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.xs },
  count: { ...text.bodySemi, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, gap: space.sm },
  name: { ...text.body, flex: 1 },
  stock: { ...text.caption },
  link: { ...text.bodySemi, marginTop: space.sm, textAlign: 'right' },
});
