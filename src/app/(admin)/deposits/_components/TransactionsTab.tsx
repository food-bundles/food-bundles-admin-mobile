import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useDepositsStore } from '@/stores/depositsStore';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TransactionType, WalletTransaction } from '@/mocks/deposits';
import { TransactionDetailSheet } from './TransactionDetailSheet';

const TYPE_TONE = { TOP_UP: 'leaf', WITHDRAWAL: 'chili', ORDER_PAYMENT: 'neutral', REFUND: 'marigold' } as const;
const TYPE_KEY: Record<TransactionType, TranslationKey> = {
  TOP_UP: 'deposits.typeTopUp',
  WITHDRAWAL: 'deposits.typeWithdrawal',
  ORDER_PAYMENT: 'deposits.typeOrderPayment',
  REFUND: 'deposits.typeRefund',
};

/** Type badge + restaurant + amount + method + date. Tap → full detail sheet. */
export function TransactionsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const wallets = useDepositsStore((state) => state.wallets);
  const transactions = useDepositsStore((state) => state.transactions);
  const [detailTarget, setDetailTarget] = useState<WalletTransaction | null>(null);
  const sorted = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.container}>
      <DataList
        data={sorted}
        renderItem={({ item }) => {
          const wallet = wallets.find((w) => w.id === item.walletId);
          return (
            <Pressable onPress={() => setDetailTarget(item)} accessibilityRole="button" accessibilityLabel={wallet?.restaurantName ?? item.id}>
              <Card accessibilityLabel={wallet?.restaurantName ?? item.id}>
                <View style={styles.row}>
                  <View style={styles.textCol}>
                    <Text style={[styles.name, { color: colors.ink }]}>{wallet?.restaurantName}</Text>
                    <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(item.createdAt, language)}</Text>
                  </View>
                  <View style={styles.trailing}>
                    <Text style={[styles.amount, { color: item.amount < 0 ? colors.chili : colors.ripe }]}>{formatRwf(item.amount)}</Text>
                    <Badge tone={TYPE_TONE[item.type]} label={t(TYPE_KEY[item.type])} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={sorted.length === 0}
        emptyTitle={t('deposits.emptyTransactionsTitle')}
        emptyMessage={t('deposits.emptyTransactionsMessage')}
        emptyIcon={<Ionicons name="swap-horizontal-outline" size={20} color={colors.leaf} />}
      />
      <TransactionDetailSheet transaction={detailTarget} onClose={() => setDetailTarget(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
  amount: { ...text.bodySemi },
});
