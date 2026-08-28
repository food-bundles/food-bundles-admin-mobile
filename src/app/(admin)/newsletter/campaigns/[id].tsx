import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_CAMPAIGNS } from '@/mocks/newsletter';

/** Campaign detail: subject, body, recipient count, open/click rate. */
export default function CampaignDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const campaign = useMemo(() => MOCK_CAMPAIGNS.find((c) => c.id === id), [id]);

  if (!campaign) {
    return (
      <AdminScreen title={t('newsletter.title')}>
        <EmptyState icon={null} title={t('newsletter.emptyCampaignsTitle')} message={t('newsletter.emptyCampaignsMessage')} />
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={t('newsletter.campaignDetailTitle', { subject: campaign.subject })}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.subject, { color: colors.ink }]}>{campaign.subject}</Text>
          <Badge tone={campaign.status === 'SENT' ? 'leaf' : campaign.status === 'FAILED' ? 'chili' : 'neutral'} label={campaign.status} />
        </View>
        <Card>
          <Text style={[styles.body, { color: colors.body }]}>{campaign.body}</Text>
        </Card>
        <Card>
          <Row label={t('newsletter.recipients', { count: campaign.recipientCount })} />
          <Row label={`${t('newsletter.openRate')}: ${(campaign.openRate * 100).toFixed(0)}%`} />
          <Row label={`${t('newsletter.clickRate')}: ${(campaign.clickRate * 100).toFixed(0)}%`} />
        </Card>
      </ScrollView>
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
  body: { ...text.body },
  row: { ...text.body, paddingVertical: space.xs },
});
