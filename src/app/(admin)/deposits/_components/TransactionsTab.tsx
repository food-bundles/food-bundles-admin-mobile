import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_TRANSACTIONS, MOCK_WALLETS } from '@/mocks/deposits';

const TYPE_TONE = { TOP_UP: 'leaf', WITHDRAWAL: 'chili', ORDER_PAYMENT: 'neutral', REFUND: 'marigold' } as const;

/** Type badge + restaurant + amount + method + date. */
export function TransactionsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const sorted = [...MOCK_TRANSACTIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DataList
      data={sorted}
      renderItem={({ item }) => {
        const wallet = MOCK_WALLETS.find((w) => w.id === item.walletId);
        return (
          <Card accessibilityLabel={wallet?.restaurantName ?? item.id}>
            <View style={styles.row}>
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{wallet?.restaurantName}</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(item.createdAt, language)}</Text>
              </View>
              <View style={styles.trailing}>
                <Text style={[styles.amount, { color: item.amount < 0 ? colors.chili : colors.ripe }]}>{formatRwf(item.amount)}</Text>
                <Badge tone={TYPE_TONE[item.type]} label={item.type.replace('_', ' ')} />
              </View>
            </View>
          </Card>
        );
      }}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isEmpty={sorted.length === 0}
      emptyTitle={t('deposits.emptyTransactionsTitle')}
      emptyMessage={t('deposits.emptyTransactionsMessage')}
      emptyIcon={<Ionicons name="swap-horizontal-outline" size={20} color={colors.leaf} />}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
  amount: { ...text.bodySemi },
});
