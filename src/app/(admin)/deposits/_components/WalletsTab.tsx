import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import { useAuthStore } from '@/stores/authStore';
import { useDepositsStore } from '@/stores/depositsStore';
import { DataList } from '@/components/data/DataList';
import { ExpandRow } from '@/components/data/ExpandRow';
import { Button } from '@/components/ui/Button';
import type { Wallet } from '@/mocks/deposits';
import { TopUpWalletSheet } from './TopUpWalletSheet';

const CAN_TOPUP_ROLES = ['SUPERUSER', 'ADMIN'];

/** Restaurant name + balance + default method + last activity. Row expands to last 3 transactions inline. */
export function WalletsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const role = useAuthStore((state) => state.user?.role);
  const wallets = useDepositsStore((state) => state.wallets);
  const transactions = useDepositsStore((state) => state.transactions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [topUpTarget, setTopUpTarget] = useState<Wallet | null>(null);
  const canTopUp = role ? CAN_TOPUP_ROLES.includes(role) : false;

  return (
    <View style={styles.container}>
      <DataList
        data={wallets}
        renderItem={({ item }) => {
          const recentTx = [...transactions]
            .filter((tx) => tx.walletId === item.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          return (
            <ExpandRow
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
              accessibilityLabel={item.restaurantName}
              header={
                <View style={styles.row}>
                  <View style={styles.textCol}>
                    <Text style={[styles.name, { color: colors.ink }]}>{item.restaurantName}</Text>
                    <Text style={[styles.detail, { color: colors.muted }]}>
                      {t('deposits.defaultMethod')}: {t(PAYMENT_METHOD_KEY[item.defaultPaymentMethod])}
                    </Text>
                    {recentTx[0] ? (
                      <Text style={[styles.detail, { color: colors.muted }]}>
                        {t('deposits.lastActivity')}: {formatDate(recentTx[0].createdAt, language)}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={[styles.balance, { color: colors.ink }]}>{formatRwf(item.balance)}</Text>
                </View>
              }
            >
              <View style={styles.panel}>
                {recentTx.length === 0 ? (
                  <Text style={[styles.detail, { color: colors.muted }]}>{t('deposits.noTransactions')}</Text>
                ) : (
                  recentTx.map((tx) => (
                    <View key={tx.id} style={styles.txRow}>
                      <Text style={[styles.txType, { color: colors.body }]}>{tx.type}</Text>
                      <Text style={[styles.txAmount, { color: colors.ink }]}>{formatRwf(tx.amount)}</Text>
                    </View>
                  ))
                )}
                {canTopUp ? (
                  <Button variant="secondary" size="sm" onPress={() => setTopUpTarget(item)}>
                    {t('deposits.topUpWallet')}
                  </Button>
                ) : null}
              </View>
            </ExpandRow>
          );
        }}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={wallets.length === 0}
        emptyTitle={t('deposits.emptyWalletsTitle')}
        emptyMessage={t('deposits.emptyWalletsMessage')}
        emptyIcon={<Ionicons name="wallet-outline" size={20} color={colors.leaf} />}
      />
      <TopUpWalletSheet wallet={topUpTarget} onClose={() => setTopUpTarget(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  balance: { ...text.bodySemi },
  panel: { paddingHorizontal: space.lg, gap: space.xs },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  txType: { ...text.caption },
  txAmount: { ...text.caption, fontWeight: '600' },
});
