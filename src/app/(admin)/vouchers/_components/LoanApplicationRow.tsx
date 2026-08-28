import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useLanguageStore } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { LoanApplication } from '@/mocks/loans';

const STATUS_TONE = { PENDING: 'marigold', APPROVED: 'leaf', REJECTED: 'chili', ACCEPTED: 'leaf', DISBURSED: 'leaf' } as const;

export interface LoanApplicationRowProps {
  application: LoanApplication;
  onPress: () => void;
}

/** Restaurant name + amount + status chip + date. Tier is folded into the approved voucherType once set. */
export function LoanApplicationRow({ application, onPress }: LoanApplicationRowProps) {
  const { colors } = useTheme();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={onPress} accessibilityLabel={application.restaurantName}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{application.restaurantName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(application.requestedAt, language)}</Text>
        </View>
        <View style={styles.trailing}>
          <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(application.requestedAmount)}</Text>
          <Badge tone={STATUS_TONE[application.status]} label={application.status} />
        </View>
      </View>
    </Card>
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
