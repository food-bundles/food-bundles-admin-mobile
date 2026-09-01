import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useDepositsStore } from '@/stores/depositsStore';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Withdrawal } from '@/mocks/withdrawals';
import { WithdrawalDetailSheet } from './WithdrawalDetailSheet';

const STATUS_TONE = { PENDING: 'marigold', APPROVED: 'leaf', REJECTED: 'chili' } as const;

/** Restaurant + amount + status chip + date. Tapping a PENDING withdrawal opens its detail sheet with Approve/Reject. */
export function WithdrawalsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const withdrawals = useDepositsStore((state) => state.withdrawals);
  const [detailTarget, setDetailTarget] = useState<Withdrawal | null>(null);

  return (
    <View style={styles.container}>
      <DataList
        data={withdrawals}
        renderItem={({ item }) => (
          <Pressable onPress={() => setDetailTarget(item)} accessibilityRole="button" accessibilityLabel={item.restaurantName}>
            <Card accessibilityLabel={item.restaurantName}>
              <View style={styles.row}>
                <View style={styles.textCol}>
                  <Text style={[styles.name, { color: colors.ink }]}>{item.restaurantName}</Text>
                  <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(item.requestedAt, language)}</Text>
                </View>
                <View style={styles.trailing}>
                  <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(item.amount)}</Text>
                  <Badge tone={STATUS_TONE[item.status]} label={item.status} />
                </View>
              </View>
            </Card>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={withdrawals.length === 0}
        emptyTitle={t('deposits.emptyWithdrawalsTitle')}
        emptyMessage={t('deposits.emptyWithdrawalsMessage')}
        emptyIcon={<Ionicons name="arrow-down-circle-outline" size={20} color={colors.leaf} />}
      />
      <WithdrawalDetailSheet withdrawal={detailTarget} onClose={() => setDetailTarget(null)} />
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
