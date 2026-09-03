import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useNewsletterStore } from '@/stores/newsletterStore';
import type { CampaignStatus } from '@/mocks/newsletter';

const STATUS_TONE: Record<CampaignStatus, 'neutral' | 'leaf' | 'chili'> = { DRAFT: 'neutral', SENT: 'leaf', FAILED: 'chili' };

/** Campaign list: subject + recipient count + status. */
export function CampaignsTab() {
  const { colors } = useTheme();
  const t = useT();
  const campaigns = useNewsletterStore((state) => state.campaigns);

  return (
    <DataList
      data={campaigns}
      renderItem={({ item }) => (
        <Card onPress={() => router.push(`/(admin)/newsletter/campaigns/${item.id}`)} accessibilityLabel={item.subject}>
          <View style={styles.row}>
            <View style={styles.textCol}>
              <Text style={[styles.subject, { color: colors.ink }]} numberOfLines={1}>
                {item.subject}
              </Text>
              <Text style={[styles.detail, { color: colors.muted }]}>{t('newsletter.recipients', { count: item.recipientCount })}</Text>
            </View>
            <Badge tone={STATUS_TONE[item.status]} label={item.status} />
          </View>
        </Card>
      )}
      keyExtractor={(item) => item.id}
      isLoading={false}
      isEmpty={campaigns.length === 0}
      emptyTitle={t('newsletter.emptyCampaignsTitle')}
      emptyMessage={t('newsletter.emptyCampaignsMessage')}
      emptyIcon={<Ionicons name="megaphone-outline" size={20} color={colors.leaf} />}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  textCol: { flex: 1 },
  subject: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
