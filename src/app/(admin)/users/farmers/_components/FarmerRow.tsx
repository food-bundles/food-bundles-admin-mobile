import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Badge } from '@/components/ui/Badge';
import { ExpandRow } from '@/components/data/ExpandRow';
import type { Farmer } from '@/mocks/farmers';
import { MOCK_FARMER_SUBMISSIONS } from '@/mocks/farmer-submissions';

const STATUS_TONE = { APPROVED: 'leaf', PENDING: 'marigold', SUSPENDED: 'chili' } as const;

export interface FarmerRowProps {
  farmer: Farmer;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Avatar + name + farm name + location + status chip + submission count + joined date. Expands to
 * show products offered (chips) and the latest submission status, with a "View details" link.
 */
export function FarmerRow({ farmer, expanded, onToggle }: FarmerRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const latestSubmission = [...MOCK_FARMER_SUBMISSIONS]
    .filter((s) => s.farmerId === farmer.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

  return (
    <ExpandRow expanded={expanded} onToggle={onToggle} accessibilityLabel={farmer.name} header={
      <View style={styles.header}>
        <Image source={{ uri: farmer.imageUri }} style={styles.avatar} />
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{farmer.name}</Text>
          <Text style={[styles.farmName, { color: colors.muted }]}>
            {farmer.farmName} · {farmer.location}
          </Text>
        </View>
        <Badge tone={STATUS_TONE[farmer.status]} label={farmer.status} />
      </View>
    }>
      <View style={styles.panel}>
        <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t('farmers.productsOffered')}</Text>
        <View style={styles.chipRow}>
          {farmer.products.map((product) => (
            <View key={product} style={[styles.chip, { backgroundColor: colors.neutral }]}>
              <Text style={[styles.chipLabel, { color: colors.body }]}>{product}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.detailLine, { color: colors.body }]}>
          {t('farmers.latestSubmission')}: {latestSubmission ? `${latestSubmission.productName} · ${latestSubmission.status}` : '—'}
        </Text>
        <Text style={[styles.detailLine, { color: colors.muted }]}>
          {t('farmers.submissionHistory')}: {farmer.submissionsCount} · {formatDate(farmer.createdAt, language)}
        </Text>
        <Pressable
          onPress={() => router.push(`/(admin)/users/farmers/${farmer.id}`)}
          accessibilityRole="button"
          accessibilityLabel={t('farmers.viewDetails')}
        >
          <Text style={[styles.viewLink, { color: colors.leaf }]}>{t('farmers.viewDetails')}</Text>
        </Pressable>
      </View>
    </ExpandRow>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  farmName: { ...text.caption, marginTop: 2 },
  panel: { paddingHorizontal: space.lg, gap: space.sm },
  sectionLabel: { ...text.overline },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  chip: { paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.pill },
  chipLabel: { ...text.caption },
  detailLine: { ...text.body },
  viewLink: { ...text.bodySemi, marginTop: space.xs },
});
