import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
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
import { useNewsletterStore } from '@/stores/newsletterStore';
import { PerformanceSection } from './_components/PerformanceSection';
import { RecipientsSection } from './_components/RecipientsSection';

/**
 * Campaign detail: subject/status/sent date; "Performance" (SENT only — open/click gauges,
 * opened-vs-not chart); "Content preview"; "Recipients" (first 3 + view all); actions:
 * DRAFT -> Send now, FAILED -> Retry (same mock as Resend), all -> Duplicate.
 */
export default function CampaignDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const campaigns = useNewsletterStore((state) => state.campaigns);
  const sendNow = useNewsletterStore((state) => state.sendNow);
  const duplicate = useNewsletterStore((state) => state.duplicate);
  const campaign = useMemo(() => campaigns.find((c) => c.id === id), [campaigns, id]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!campaign) {
    return (
      <AdminScreen title={t('newsletter.title')}>
        <EmptyState icon={null} title={t('newsletter.emptyCampaignsTitle')} message={t('newsletter.emptyCampaignsMessage')} />
      </AdminScreen>
    );
  }

  const primaryActionLabel = campaign.status === 'DRAFT' ? t('newsletter.sendNow') : campaign.status === 'FAILED' ? t('newsletter.retry') : null;

  const handlePrimaryAction = () => {
    sendNow(campaign.id);
    setConfirmOpen(false);
    setActionSuccess(t('newsletter.resendSuccess', { count: 25 }));
  };

  const handleDuplicate = () => {
    const copy = duplicate(campaign.id);
    if (copy) router.push(`/(admin)/newsletter/campaigns/${copy.id}`);
  };

  return (
    <AdminScreen title={t('newsletter.campaignDetailTitle', { subject: campaign.subject })} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.subject, { color: colors.ink }]}>{campaign.subject}</Text>
          <Badge tone={campaign.status === 'SENT' ? 'leaf' : campaign.status === 'FAILED' ? 'chili' : 'neutral'} label={campaign.status} />
        </View>
        <Text style={[styles.sentAt, { color: colors.muted }]}>
          {campaign.sentAt ? t('newsletter.sentAt', { date: formatDate(campaign.sentAt, language) }) : t('newsletter.notSentYet')}
        </Text>

        {campaign.status === 'SENT' ? <PerformanceSection campaign={campaign} /> : null}

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('newsletter.contentPreview')}</Text>
        <Card>
          <Text style={[styles.body, { color: colors.body }]}>{campaign.body}</Text>
        </Card>

        <RecipientsSection campaign={campaign} />

        {actionSuccess ? <Text style={[styles.success, { color: colors.ripe }]}>{actionSuccess}</Text> : null}

        {primaryActionLabel ? (
          <Button variant="primary" fullWidth onPress={() => setConfirmOpen(true)}>
            {primaryActionLabel}
          </Button>
        ) : null}
        <Button variant="ghost" fullWidth onPress={handleDuplicate}>
          {t('newsletter.duplicate')}
        </Button>
      </ScrollView>

      <ConfirmDialog
        visible={confirmOpen}
        title={primaryActionLabel ?? ''}
        message={t('newsletter.resendConfirmMessage', { subject: campaign.subject, count: 25 })}
        confirmLabel={primaryActionLabel ?? t('common.confirm')}
        variant="warning"
        onConfirm={handlePrimaryAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subject: { ...text.h2, flex: 1 },
  sentAt: { ...text.caption },
  sectionTitle: { ...text.h3 },
  body: { ...text.body },
  success: { ...text.bodySemi },
});
