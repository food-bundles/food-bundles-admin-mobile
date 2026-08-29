import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConsentSourcesList } from '@/components/data/ConsentSourcesList';
import { CreditScoreGauge } from '@/components/charts/CreditScoreGauge';
import { computeCreditLimit, computeWeightedScore, salesTier } from '@/lib/creditScoring';
import type { LoanApplication } from '@/mocks/loanApplications';
import { ApproveSubSheet } from './ApproveSubSheet';
import { RejectSubSheet } from './RejectSubSheet';

export interface LoanApplicationSheetProps {
  application: LoanApplication | null;
  canManage: boolean;
  onClose: () => void;
  onApprove: (approvedLimit: number) => void;
  onReject: (reason: string) => void;
}

/**
 * Loan Application detail sheet: restaurant header, data-source authorization
 * grid, animated credit-score gauge with contribution bars, approved credit
 * limit, questionnaire answers, and role-gated Approve/Reject actions (each
 * behind an OTP confirmation step).
 */
export function LoanApplicationSheet({ application, canManage, onClose, onApprove, onReject }: LoanApplicationSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const score = useMemo(() => {
    if (!application) return null;
    const granted = new Set(application.consent.filter((c) => c.granted).map((c) => c.source));
    return computeWeightedScore(granted);
  }, [application]);

  if (!application || !score) return null;

  const tier = salesTier(application.verifiedAvgMonthlySales);
  const computedLimit = computeCreditLimit(application.verifiedAvgMonthlySales, application.currentExposure);
  const anyDenied = application.consent.some((c) => !c.granted);
  const isDecided = application.status === 'APPROVED' || application.status === 'REJECTED';

  return (
    <>
      <Sheet visible={application !== null && !approveOpen && !rejectOpen} height="tall" onClose={onClose}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: colors.ink }]}>{application.restaurantName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>TIN {application.tin} · {application.phone} · {application.district}</Text>

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('vouchers.dataSourcesAuthorized')}</Text>
          <ConsentSourcesList consent={application.consent} />

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('vouchers.scoreBreakdown')}</Text>
          <Card>
            <CreditScoreGauge score={application.scoreTier ? { ...score, tier: application.scoreTier } : score} anyDenied={anyDenied} />
          </Card>

          <Card>
            <Text style={[styles.limitLabel, { color: colors.muted }]}>{t('vouchers.approvedLimit')}</Text>
            <Text style={[styles.limitValue, { color: colors.leaf }]}>{formatRwf(application.approvedLimit ?? computedLimit)}</Text>
          </Card>

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('vouchers.questionnaire')}</Text>
          <Card style={styles.questionnaireCard}>
            <QARow label={t('vouchers.purpose')} value={application.questionnaire.purpose} />
            <QARow label={t('vouchers.orderingFrequency')} value={application.questionnaire.orderingFrequency} />
            <QARow label={t('vouchers.preferredRepaymentDays')} value={String(application.questionnaire.preferredRepaymentDays)} />
          </Card>

          {application.rejectionReason ? (
            <Card>
              <Text style={[styles.limitLabel, { color: colors.muted }]}>{t('vouchers.rejectionReason')}</Text>
              <Text style={[styles.detail, { color: colors.chili }]}>{application.rejectionReason}</Text>
            </Card>
          ) : null}

          {canManage && !isDecided ? (
            <View style={styles.actions}>
              <Button variant="primary" fullWidth onPress={() => setApproveOpen(true)} accessibilityLabel={t('vouchers.approveAction')}>
                {t('vouchers.approve')}
              </Button>
              <Button variant="destructive" fullWidth onPress={() => setRejectOpen(true)} accessibilityLabel={t('vouchers.rejectAction')}>
                {t('vouchers.reject')}
              </Button>
            </View>
          ) : null}
        </ScrollView>
      </Sheet>

      <ApproveSubSheet
        visible={approveOpen}
        tier={tier}
        computedLimit={computedLimit}
        onClose={() => setApproveOpen(false)}
        onApprove={(amount) => {
          onApprove(amount);
          onClose();
        }}
      />
      <RejectSubSheet
        visible={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onReject={(reason) => {
          onReject(reason);
          onClose();
        }}
      />
    </>
  );
}

function QARow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.qaRow}>
      <Text style={[styles.qaLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.qaValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, padding: space.lg, paddingBottom: space.xxxl },
  title: { ...text.h2 },
  detail: { ...text.caption },
  sectionTitle: { ...text.label, marginTop: space.sm },
  limitLabel: { ...text.caption },
  limitValue: { ...text.priceLg, marginTop: 2 },
  questionnaireCard: { gap: space.sm },
  qaRow: { gap: 2 },
  qaLabel: { ...text.caption },
  qaValue: { ...text.body },
  actions: { gap: space.sm, marginTop: space.md },
});
