import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { MOCK_WALLETS, MOCK_TRANSACTIONS } from '@/mocks/deposits';

/** Restaurant name + balance + default method + last activity. */
export function WalletsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <DataList
      data={MOCK_WALLETS}
      renderItem={({ item }) => {
        const lastTx = [...MOCK_TRANSACTIONS]
          .filter((tx) => tx.walletId === item.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        return (
          <Card accessibilityLabel={item.restaurantName}>
            <View style={styles.row}>
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{item.restaurantName}</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>
                  {t('deposits.defaultMethod')}: {t(PAYMENT_METHOD_KEY[item.defaultPaymentMethod])}
                </Text>
                {lastTx ? (
                  <Text style={[styles.detail, { color: colors.muted }]}>
                    {t('deposits.lastActivity')}: {formatDate(lastTx.createdAt, language)}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.balance, { color: colors.ink }]}>{formatRwf(item.balance)}</Text>
            </View>
          </Card>
        );
      }}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isEmpty={MOCK_WALLETS.length === 0}
      emptyTitle={t('deposits.emptyWalletsTitle')}
      emptyMessage={t('deposits.emptyWalletsMessage')}
      emptyIcon={<Ionicons name="wallet-outline" size={20} color={colors.leaf} />}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  balance: { ...text.bodySemi },
});
