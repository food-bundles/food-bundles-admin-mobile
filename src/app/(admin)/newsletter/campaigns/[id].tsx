import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_CAMPAIGNS } from '@/mocks/newsletter';

/** Campaign detail: subject, body, sent date, recipient count, open/click rate, mock "resend" action. */
export default function CampaignDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const campaign = useMemo(() => MOCK_CAMPAIGNS.find((c) => c.id === id), [id]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!campaign) {
    return (
      <AdminScreen title={t('newsletter.title')}>
        <EmptyState icon={null} title={t('newsletter.emptyCampaignsTitle')} message={t('newsletter.emptyCampaignsMessage')} />
      </AdminScreen>
    );
  }

  const canResend = campaign.status === 'SENT' || campaign.status === 'FAILED';

  return (
    <AdminScreen title={t('newsletter.campaignDetailTitle', { subject: campaign.subject })}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.subject, { color: colors.ink }]}>{campaign.subject}</Text>
          <Badge tone={campaign.status === 'SENT' ? 'leaf' : campaign.status === 'FAILED' ? 'chili' : 'neutral'} label={campaign.status} />
        </View>
        <Text style={[styles.sentAt, { color: colors.muted }]}>
          {campaign.sentAt ? t('newsletter.sentAt', { date: formatDate(campaign.sentAt, language) }) : t('newsletter.notSentYet')}
        </Text>
        <Card>
          <Text style={[styles.body, { color: colors.body }]}>{campaign.body}</Text>
        </Card>
        <Card>
          <Row label={t('newsletter.recipients', { count: campaign.recipientCount })} />
          <Row label={`${t('newsletter.openRate')}: ${(campaign.openRate * 100).toFixed(0)}%`} />
          <Row label={`${t('newsletter.clickRate')}: ${(campaign.clickRate * 100).toFixed(0)}%`} />
        </Card>

        {resendSuccess ? (
          <Text style={[styles.success, { color: colors.ripe }]}>
            {t('newsletter.resendSuccess', { count: campaign.recipientCount })}
          </Text>
        ) : null}

        {canResend ? (
          <Button variant="secondary" fullWidth onPress={() => setConfirmOpen(true)} accessibilityLabel={t('newsletter.resend')}>
            {t('newsletter.resend')}
          </Button>
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={confirmOpen}
        title={t('newsletter.resendConfirmTitle')}
        message={t('newsletter.resendConfirmMessage', { subject: campaign.subject, count: campaign.recipientCount })}
        confirmLabel={t('newsletter.resend')}
        variant="warning"
        onConfirm={() => {
          setConfirmOpen(false);
          setResendSuccess(true);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminScreen>
  );
}

function Row({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.row, { color: colors.body }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subject: { ...text.h2, flex: 1 },
  sentAt: { ...text.caption },
  body: { ...text.body },
  row: { ...text.body, paddingVertical: space.xs },
  success: { ...text.bodySemi },
});
