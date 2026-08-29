import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_WALLETS, MOCK_TRANSACTIONS, type TransactionType } from '@/mocks/deposits';

const TYPE_KEY: Record<TransactionType, TranslationKey> = {
  TOP_UP: 'deposits.typeTopUp',
  WITHDRAWAL: 'deposits.typeWithdrawal',
  ORDER_PAYMENT: 'deposits.typeOrderPayment',
  REFUND: 'deposits.typeRefund',
};

export interface RestaurantWalletTabProps {
  restaurantId: string;
}

/** Current balance + 5 most recent transactions + link to the full Deposits screen. */
export function RestaurantWalletTab({ restaurantId }: RestaurantWalletTabProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const wallet = MOCK_WALLETS.find((w) => w.restaurantId === restaurantId);
  const transactions = MOCK_TRANSACTIONS.filter((tx) => tx.restaurantId === restaurantId).slice(0, 5);

  if (!wallet) {
    return <EmptyState icon={null} title={t('restaurants.noTransactions')} message={t('restaurants.noTransactions')} />;
  }

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.balance, { color: colors.ink }]}>{formatRwf(wallet.balance)}</Text>
      </Card>

      {transactions.length === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>{t('restaurants.noTransactions')}</Text>
      ) : (
        <Card>
          {transactions.map((tx, index) => (
            <View key={tx.id} style={[styles.row, index < transactions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}>
              <Text style={[styles.type, { color: colors.ink }]}>{t(TYPE_KEY[tx.type])}</Text>
              <View style={styles.amountCol}>
                <Text style={[styles.amount, { color: tx.amount < 0 ? colors.chili : colors.ripe }]}>{formatRwf(tx.amount)}</Text>
                <Text style={[styles.date, { color: colors.muted }]}>{formatDate(tx.createdAt, language)}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      <Button variant="secondary" fullWidth onPress={() => router.push('/(admin)/deposits')}>
        {t('restaurants.viewFullWallet')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  balance: { ...text.priceHero },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.sm },
  type: { ...text.body },
  amountCol: { alignItems: 'flex-end' },
  amount: { ...text.bodySemi },
  date: { ...text.caption, marginTop: 2 },
  empty: { ...text.caption },
});
