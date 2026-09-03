import { StyleSheet, Text, View } from 'react-native';
import { font, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatRelative } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreTierBadge } from '@/components/ui/ScoreTierBadge';
import type { LoanApplication, LoanApplicationStatus } from '@/mocks/loanApplications';

const STATUS_TONE: Record<LoanApplicationStatus, 'marigold' | 'neutral' | 'leaf' | 'chili'> = {
  PENDING: 'marigold',
  UNDER_REVIEW: 'neutral',
  APPROVED: 'leaf',
  REJECTED: 'chili',
};

const STATUS_KEY: Record<LoanApplicationStatus, TranslationKey> = {
  PENDING: 'vouchers.statusPending',
  UNDER_REVIEW: 'vouchers.statusUnderReview',
  APPROVED: 'vouchers.statusApproved',
  REJECTED: 'vouchers.statusRejected',
};

export interface LoanApplicationRowProps {
  application: LoanApplication;
  onPress: () => void;
}

/** Restaurant name+TIN, requested amount, approved-vs-requested, score tier badge, status chip, relative date. */
export function LoanApplicationRow({ application, onPress }: LoanApplicationRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={onPress} accessibilityLabel={`${application.restaurantName}, ${t(STATUS_KEY[application.status])}`}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{application.restaurantName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>TIN {application.tin}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatRelative(application.submittedAt, language, t)}</Text>
        </View>
        <View style={styles.trailing}>
          <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(application.requestedAmount)}</Text>
          {application.approvedLimit !== null ? (
            <Text style={[styles.detail, { color: colors.leaf }]}>{formatRwf(application.approvedLimit)}</Text>
          ) : null}
          <View style={styles.badgeRow}>
            {application.scoreTier ? <ScoreTierBadge tier={application.scoreTier} /> : null}
            <Badge tone={STATUS_TONE[application.status]} label={t(STATUS_KEY[application.status])} />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  textCol: { flex: 1, gap: 2 },
  name: { ...text.bodySemi },
  detail: { ...text.caption },
  trailing: { alignItems: 'flex-end', gap: space.xs },
  amount: { ...text.bodySemi, fontFamily: font.displayBold },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
