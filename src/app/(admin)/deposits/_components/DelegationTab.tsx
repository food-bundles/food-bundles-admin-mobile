import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { MOCK_DELEGATIONS } from '@/mocks/withdrawals';

/** Delegator + delegate + cap + daily limit + time window. */
export function DelegationTab() {
  const { colors } = useTheme();
  const t = useT();

  return (
    <DataList
      data={MOCK_DELEGATIONS}
      renderItem={({ item }) => (
        <Card accessibilityLabel={`${item.delegatorName} → ${item.delegateName}`}>
          <Text style={[styles.names, { color: colors.ink }]}>
            {item.delegatorName} → {item.delegateName}
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detail, { color: colors.muted }]}>
              {t('deposits.dailyLimit')}: {formatRwf(item.dailyLimit)}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
              {t('deposits.cap')}: {formatRwf(item.cap)}
            </Text>
          </View>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('deposits.timeWindow')}: {item.timeWindow}
          </Text>
        </Card>
      )}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isEmpty={MOCK_DELEGATIONS.length === 0}
      emptyTitle={t('deposits.emptyDelegationTitle')}
      emptyMessage={t('deposits.emptyDelegationMessage')}
      emptyIcon={<Ionicons name="people-outline" size={20} color={colors.leaf} />}
    />
  );
}

const styles = StyleSheet.create({
  names: { ...text.bodySemi },
  detailRow: { flexDirection: 'row', gap: space.md, marginTop: space.xs },
  detail: { ...text.caption },
});
