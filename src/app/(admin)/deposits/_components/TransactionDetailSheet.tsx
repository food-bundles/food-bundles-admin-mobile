import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Button } from '@/components/ui/Button';
import { MOCK_ORDERS } from '@/mocks/orders';
import type { WalletTransaction } from '@/mocks/deposits';

export interface TransactionDetailSheetProps {
  transaction: WalletTransaction | null;
  onClose: () => void;
}

/** All fields including reference number, notes, and a linked order (for ORDER_PAYMENT type) if any. */
export function TransactionDetailSheet({ transaction, onClose }: TransactionDetailSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const linkedOrder = transaction?.type === 'ORDER_PAYMENT' ? MOCK_ORDERS.find((o) => o.restaurantId === transaction.restaurantId) : undefined;

  return (
    <Sheet visible={transaction !== null} height="medium" onClose={onClose}>
      {transaction ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.ink }]}>{transaction.type}</Text>
          <Row label={t('deposits.amount')} value={formatRwf(transaction.amount)} />
          <Row label={t('deposits.balanceAfter')} value={formatRwf(transaction.balanceAfter)} />
          <Row label={t('deposits.reference')} value={transaction.reference} />
          <Row label={t('deposits.date')} value={formatDate(transaction.createdAt, language)} />
          <Row label={t('deposits.notes')} value={t('deposits.notesDefault')} />

          {linkedOrder ? (
            <Button variant="ghost" fullWidth onPress={() => { onClose(); router.push(`/(admin)/orders/${linkedOrder.id}`); }}>
              {t('deposits.viewLinkedOrder', { id: linkedOrder.id })}
            </Button>
          ) : null}
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2, marginBottom: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.xs },
  rowLabel: { ...text.body },
  rowValue: { ...text.bodySemi },
});
