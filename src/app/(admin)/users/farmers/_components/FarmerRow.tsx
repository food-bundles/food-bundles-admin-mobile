import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Farmer } from '@/mocks/farmers';

const STATUS_TONE = { APPROVED: 'leaf', PENDING: 'marigold', SUSPENDED: 'chili' } as const;

export interface FarmerRowProps {
  farmer: Farmer;
}

/** Avatar + name + farm name + location + status chip + submission count + joined date. */
export function FarmerRow({ farmer }: FarmerRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card onPress={() => router.push(`/(admin)/users/farmers/${farmer.id}`)} accessibilityLabel={farmer.name}>
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
      <View style={styles.footer}>
        <Text style={[styles.detail, { color: colors.muted }]}>{t('farmers.submissionHistory')}: {farmer.submissionsCount}</Text>
        <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(farmer.createdAt, language)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  farmName: { ...text.caption, marginTop: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  detail: { ...text.caption },
});
