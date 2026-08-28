import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useAuthStore } from '@/stores/authStore';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_WITHDRAWALS, type Withdrawal, type WithdrawalStatus } from '@/mocks/withdrawals';

const STATUS_TONE = { PENDING: 'marigold', APPROVED: 'leaf', REJECTED: 'chili' } as const;
const CAN_ACT_ROLES = ['SUPERUSER', 'ADMIN'];

/** Restaurant + amount + status chip + date. Approve/Reject on PENDING rows (ADMIN+). */
export function WithdrawalsTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const role = useAuthStore((state) => state.user?.role);
  const canAct = role ? CAN_ACT_ROLES.includes(role) : false;
  const [overrides, setOverrides] = useState<Record<string, WithdrawalStatus>>({});

  const withdrawals: Withdrawal[] = MOCK_WITHDRAWALS.map((w) => (overrides[w.id] ? { ...w, status: overrides[w.id] } : w));

  return (
    <DataList
      data={withdrawals}
      renderItem={({ item }) => (
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
          {canAct && item.status === 'PENDING' ? (
            <View style={styles.actions}>
              <View style={styles.actionSlot}>
                <Button variant="primary" size="sm" onPress={() => setOverrides((prev) => ({ ...prev, [item.id]: 'APPROVED' }))}>
                  {t('common.approve')}
                </Button>
              </View>
              <View style={styles.actionSlot}>
                <Button variant="destructive" size="sm" onPress={() => setOverrides((prev) => ({ ...prev, [item.id]: 'REJECTED' }))}>
                  {t('common.reject')}
                </Button>
              </View>
            </View>
          ) : null}
        </Card>
      )}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isEmpty={withdrawals.length === 0}
      emptyTitle={t('deposits.emptyWithdrawalsTitle')}
      emptyMessage={t('deposits.emptyWithdrawalsMessage')}
      emptyIcon={<Ionicons name="arrow-down-circle-outline" size={20} color={colors.leaf} />}
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
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  actionSlot: { flex: 1 },
});
