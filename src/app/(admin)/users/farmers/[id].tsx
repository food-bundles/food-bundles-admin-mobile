import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_FARMERS, type Farmer, type FarmerStatus } from '@/mocks/farmers';
import { MOCK_FARMER_SUBMISSIONS } from '@/mocks/farmer-submissions';
import { FarmerActions } from './_components/FarmerActions';
import { AddFarmerProductSheet } from './_components/AddFarmerProductSheet';

/** Farmer detail: profile photo, personal + farm info, products, submission history, actions. */
export default function FarmerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const baseFarmer = useMemo(() => MOCK_FARMERS.find((f) => f.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<FarmerStatus | null>(null);
  const [extraProducts, setExtraProducts] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const farmer: Farmer | undefined = baseFarmer && statusOverride ? { ...baseFarmer, status: statusOverride } : baseFarmer;

  if (!farmer) {
    return (
      <AdminScreen title={t('farmers.title')}>
        <EmptyState icon={null} title={t('farmers.emptyTitle')} message={t('farmers.emptyMessage')} />
      </AdminScreen>
    );
  }

  const submissions = MOCK_FARMER_SUBMISSIONS.filter((s) => s.farmerId === farmer.id).slice(0, 5);
  const products = [...farmer.products, ...extraProducts];

  return (
    <AdminScreen title={farmer.name}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: farmer.imageUri }} style={styles.photo} />

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('farmers.personalInfo')}</Text>
        <Card>
          <Text style={[styles.name, { color: colors.ink }]}>{farmer.name}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{farmer.email}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{farmer.phone}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('farmers.farmInfo')}</Text>
        <Card>
          <Text style={[styles.name, { color: colors.ink }]}>{farmer.farmName}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{farmer.farmType}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{farmer.location}</Text>
        </Card>

        <View style={styles.productsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('farmers.products')}</Text>
          <Button variant="ghost" size="sm" onPress={() => setSheetOpen(true)}>
            {t('farmers.addProduct')}
          </Button>
        </View>
        <View style={styles.chipRow}>
          {products.map((product) => (
            <Badge key={product} tone="leaf" label={product} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('farmers.submissionHistory')}</Text>
        {submissions.length === 0 ? (
          <Text style={[styles.detail, { color: colors.muted }]}>{t('farmers.emptyMessage')}</Text>
        ) : (
          <Card>
            {submissions.map((submission, index) => (
              <Pressable
                key={submission.id}
                onPress={() => router.push('/(admin)/farmer-submissions')}
                accessibilityRole="button"
                accessibilityLabel={submission.productName}
                style={[styles.submissionRow, index < submissions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
              >
                <Text style={[styles.name, { color: colors.ink }]}>{submission.productName}</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(submission.submittedAt, language)}</Text>
              </Pressable>
            ))}
          </Card>
        )}

        <FarmerActions farmer={farmer} onChangeStatus={setStatusOverride} />
      </ScrollView>
      <AddFarmerProductSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={(name) => setExtraProducts((prev) => [...prev, name])} />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md, alignItems: 'center' },
  photo: { width: 120, height: 120, borderRadius: 60 },
  sectionTitle: { ...text.h3, alignSelf: 'flex-start' },
  productsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignSelf: 'flex-start' },
  submissionRow: { paddingVertical: space.sm, minHeight: 44 },
});
