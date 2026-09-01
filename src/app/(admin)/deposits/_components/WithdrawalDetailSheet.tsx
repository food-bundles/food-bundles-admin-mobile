import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Button } from '@/components/ui/Button';
import { useDepositsStore } from '@/stores/depositsStore';
import type { Withdrawal } from '@/mocks/withdrawals';

export interface WithdrawalDetailSheetProps {
  withdrawal: Withdrawal | null;
  onClose: () => void;
}

/** PENDING withdrawal detail: restaurant, amount, requested date, mock reason + bank details, Approve/Reject. */
export function WithdrawalDetailSheet({ withdrawal, onClose }: WithdrawalDetailSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const setWithdrawalStatus = useDepositsStore((state) => state.setWithdrawalStatus);

  return (
    <Sheet visible={withdrawal !== null} height="medium" onClose={onClose}>
      {withdrawal ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.ink }]}>{withdrawal.restaurantName}</Text>
          <Row label={t('deposits.amount')} value={formatRwf(withdrawal.amount)} />
          <Row label={t('deposits.requestedAt')} value={formatDate(withdrawal.requestedAt, language)} />
          <Row label={t('deposits.reason')} value={t('deposits.reasonDefault')} />
          <Row label={t('deposits.bankDetails')} value={t('deposits.bankDetailsMock')} />

          {withdrawal.status === 'PENDING' ? (
            <View style={styles.actions}>
              <View style={styles.actionSlot}>
                <Button variant="primary" fullWidth onPress={() => { setWithdrawalStatus(withdrawal.id, 'APPROVED'); onClose(); }}>
                  {t('common.approve')}
                </Button>
              </View>
              <View style={styles.actionSlot}>
                <Button variant="destructive" fullWidth onPress={() => { setWithdrawalStatus(withdrawal.id, 'REJECTED'); onClose(); }}>
                  {t('common.reject')}
                </Button>
              </View>
            </View>
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
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  actionSlot: { flex: 1 },
});
