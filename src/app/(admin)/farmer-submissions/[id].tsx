import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { formatDate } from '@/lib/date';
import { useRoleGuard } from '@/lib/roleGuard';
import { qualityPhotosFor } from '@/lib/qualityPhotos';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_FARMER_SUBMISSIONS, type SubmissionStatus } from '@/mocks/farmer-submissions';
import { MOCK_FARMERS } from '@/mocks/farmers';

const ACTION_TITLE_KEY: Record<'APPROVED' | 'REJECTED' | 'VERIFIED', TranslationKey> = {
  APPROVED: 'farmerSubmissions.approve',
  REJECTED: 'farmerSubmissions.reject',
  VERIFIED: 'farmerSubmissions.verify',
};

/** Full submission: farmer photo, product details, quality photos, Approve/Reject with note, Verify (post-approval). */
export default function FarmerSubmissionDetailScreen() {
  useRoleGuard('operations');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const baseSubmission = useMemo(() => MOCK_FARMER_SUBMISSIONS.find((s) => s.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<SubmissionStatus | null>(null);
  const [note, setNote] = useState('');
  const [confirmAction, setConfirmAction] = useState<'APPROVED' | 'REJECTED' | 'VERIFIED' | null>(null);
  const submission = baseSubmission && statusOverride ? { ...baseSubmission, status: statusOverride } : baseSubmission;

  if (!submission) {
    return (
      <AdminScreen title={t('farmerSubmissions.title')}>
        <EmptyState icon={null} title={t('farmerSubmissions.emptyTitle')} message={t('farmerSubmissions.emptyMessage')} />
      </AdminScreen>
    );
  }

  const farmer = MOCK_FARMERS.find((f) => f.id === submission.farmerId);

  return (
    <AdminScreen title={submission.productName}>
      <ScrollView contentContainerStyle={styles.content}>
        {farmer ? (
          <View style={styles.farmerRow}>
            <Text style={[styles.farmerName, { color: colors.ink }]}>{farmer.name}</Text>
            <Badge tone="leaf" label={farmer.farmName} />
          </View>
        ) : null}

        <Card>
          <Text style={[styles.product, { color: colors.ink }]}>{submission.productName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('farmerSubmissions.quantity')}: {submission.quantity} {submission.unit}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {t('farmerSubmissions.pricePerUnit')}: {formatRwf(submission.pricePerUnit)}
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('farmerSubmissions.qualityPhotos')}</Text>
        <View style={styles.photoRow}>
          {qualityPhotosFor(submission.productName).map((uri, index) => (
            <Image
              key={uri + index}
              source={{ uri }}
              style={[styles.photo, { backgroundColor: colors.neutral }]}
              accessibilityLabel={`${submission.productName} quality photo ${index + 1}`}
            />
          ))}
        </View>

        {submission.status === 'PENDING' ? (
          <View style={styles.actions}>
            <Input label={t('farmerSubmissions.approveNote')} value={note} onChangeText={setNote} />
            <Button variant="primary" fullWidth onPress={() => setConfirmAction('APPROVED')}>
              {t('farmerSubmissions.approve')}
            </Button>
            <Button variant="destructive" fullWidth onPress={() => setConfirmAction('REJECTED')}>
              {t('farmerSubmissions.reject')}
            </Button>
          </View>
        ) : null}
        {submission.status === 'APPROVED' ? (
          <View style={styles.actions}>
            <Button variant="primary" fullWidth onPress={() => setConfirmAction('VERIFIED')}>
              {t('farmerSubmissions.verify')}
            </Button>
          </View>
        ) : null}
      </ScrollView>

      <ConfirmDialog
        visible={confirmAction !== null}
        title={confirmAction ? t(ACTION_TITLE_KEY[confirmAction]) : ''}
        message={submission.productName}
        confirmLabel={t('common.confirm')}
        variant={confirmAction === 'REJECTED' ? 'danger' : 'warning'}
        onConfirm={() => {
          if (confirmAction) setStatusOverride(confirmAction);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  farmerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  farmerName: { ...text.h3 },
  product: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: space.xs },
  sectionTitle: { ...text.h3 },
  photoRow: { flexDirection: 'row', gap: space.sm },
  photo: { width: 80, height: 80, borderRadius: radius.sm },
  actions: { gap: space.sm, marginTop: space.md },
});
