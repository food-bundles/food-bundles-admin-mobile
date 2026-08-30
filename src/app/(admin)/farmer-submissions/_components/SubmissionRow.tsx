import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { qualityPhotosFor } from '@/lib/qualityPhotos';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ExpandRow } from '@/components/data/ExpandRow';
import { useFarmerSubmissionsStore } from '@/stores/farmerSubmissionsStore';
import type { FarmerSubmission, SubmissionStatus } from '@/mocks/farmer-submissions';
import { MOCK_FARMERS } from '@/mocks/farmers';

const STATUS_TONE: Record<SubmissionStatus, 'marigold' | 'leaf' | 'chili'> = {
  PENDING: 'marigold',
  APPROVED: 'leaf',
  REJECTED: 'chili',
  VERIFIED: 'leaf',
};

const STATUS_KEY: Record<SubmissionStatus, TranslationKey> = {
  PENDING: 'farmerSubmissions.statusPending',
  APPROVED: 'farmerSubmissions.statusApproved',
  REJECTED: 'farmerSubmissions.statusRejected',
  VERIFIED: 'farmerSubmissions.statusVerified',
};

export interface SubmissionRowProps {
  submission: FarmerSubmission;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Farmer name + product name + quantity + unit price + submitted date + status. Expands to show
 * the farmer's farm name/location, a product photo, the quality note (if any), and Approve/Reject
 * quick actions (same store-backed handlers as the full detail screen) so an admin can act
 * without opening it.
 */
export function SubmissionRow({ submission, expanded, onToggle }: SubmissionRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const setStatus = useFarmerSubmissionsStore((state) => state.setStatus);
  const farmer = MOCK_FARMERS.find((f) => f.id === submission.farmerId);
  const photo = qualityPhotosFor(submission.productName)[0];

  return (
    <ExpandRow
      expanded={expanded}
      onToggle={onToggle}
      accessibilityLabel={submission.farmerName}
      header={
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={[styles.name, { color: colors.ink }]}>{submission.farmerName}</Text>
            <Text style={[styles.detail, { color: colors.muted }]}>
              {submission.productName} · {submission.quantity} {submission.unit}
            </Text>
            <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
          </View>
          <View style={styles.trailing}>
            <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(submission.pricePerUnit)}</Text>
            <Badge tone={STATUS_TONE[submission.status]} label={t(STATUS_KEY[submission.status])} />
          </View>
        </View>
      }
    >
      <View style={styles.panel}>
        <View style={styles.photoRow}>
          <Image source={{ uri: photo }} style={[styles.photo, { backgroundColor: colors.neutral }]} accessibilityLabel={submission.productName} />
          <View style={styles.textCol}>
            {farmer ? (
              <Text style={[styles.detail, { color: colors.body }]}>
                {t('farmerSubmissions.farmInfo')}: {farmer.farmName} · {farmer.location}
              </Text>
            ) : null}
            <Text style={[styles.detail, { color: colors.body }]}>
              {t('farmerSubmissions.qualityNote')}: {submission.note ?? t('farmerSubmissions.noQualityNote')}
            </Text>
          </View>
        </View>

        {submission.status === 'PENDING' ? (
          <View style={styles.actionsRow}>
            <View style={styles.actionButton}>
              <Button variant="primary" size="sm" fullWidth onPress={() => setStatus(submission.id, 'APPROVED')}>
                {t('farmerSubmissions.approve')}
              </Button>
            </View>
            <View style={styles.actionButton}>
              <Button variant="destructive" size="sm" fullWidth onPress={() => setStatus(submission.id, 'REJECTED')}>
                {t('farmerSubmissions.reject')}
              </Button>
            </View>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push(`/(admin)/farmer-submissions/${submission.id}`)}
          accessibilityRole="button"
          accessibilityLabel={t('restaurants.viewDetails')}
        >
          <Text style={[styles.viewLink, { color: colors.leaf }]}>{t('restaurants.viewDetails')}</Text>
        </Pressable>
      </View>
    </ExpandRow>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
  price: { ...text.bodySemi },
  panel: { paddingHorizontal: space.lg, gap: space.sm },
  photoRow: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  photo: { width: 56, height: 56, borderRadius: radius.sm },
  actionsRow: { flexDirection: 'row', gap: space.sm },
  actionButton: { flex: 1 },
  viewLink: { ...text.bodySemi },
});
