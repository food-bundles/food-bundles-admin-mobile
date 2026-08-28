import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';

export type MarketTabKey = 'markets' | 'prices' | 'analysis' | 'comparison';

const TAB_KEY: Record<MarketTabKey, TranslationKey> = {
  markets: 'markets.tabMarkets',
  prices: 'markets.tabPrices',
  analysis: 'markets.tabAnalysis',
  comparison: 'markets.tabComparison',
};

const TABS: MarketTabKey[] = ['markets', 'prices', 'analysis', 'comparison'];

export interface MarketTabsProps {
  active: MarketTabKey;
  onChange: (tab: MarketTabKey) => void;
}

/** Top segmented control: Markets | Prices | Analysis | Comparison. */
export function MarketTabs({ active, onChange }: MarketTabsProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            accessibilityLabel={t(TAB_KEY[tab])}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tab)}
            style={[styles.tab, { backgroundColor: isActive ? colors.leaf : 'transparent' }]}
          >
            <Text style={[text.bodySemi, { color: isActive ? colors.paper : colors.body }]}>{t(TAB_KEY[tab])}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md },
  tab: { minHeight: hit.min, paddingHorizontal: space.md, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
