import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_CATEGORIES, type Category } from '@/mocks/categories';
import { CategorySheet } from './_components/CategorySheet';

/** Category list + add/delete. Built from stock/categories/page.tsx. */
export default function CategoriesScreen() {
  useRoleGuard('stock');
  const { colors } = useTheme();
  const t = useT();
  const [extra, setExtra] = useState<Category[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const categories = [...MOCK_CATEGORIES, ...extra].filter((c) => !removedIds.includes(c.id));

  return (
    <AdminScreen title={t('categories.title')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" size="sm" onPress={() => setSheetOpen(true)}>
          {t('categories.create')}
        </Button>
      </View>
      <DataList
        data={categories}
        renderItem={({ item }) => (
          <Card accessibilityLabel={item.name}>
            <View style={styles.row}>
              <Image source={{ uri: item.imageUri }} style={styles.thumb} />
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>{t('categories.productCount', { count: item.productCount })}</Text>
              </View>
              <Button variant="ghost" size="sm" onPress={() => setDeleteTarget(item)}>
                {t('common.delete')}
              </Button>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={categories.length === 0}
        emptyTitle={t('categories.emptyTitle')}
        emptyMessage={t('categories.emptyMessage')}
        emptyIcon={<Ionicons name="grid-outline" size={20} color={colors.leaf} />}
      />
      <CategorySheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(name) => setExtra((prev) => [...prev, { id: `cat-${Date.now()}`, name, productCount: 0, imageUri: '' }])}
      />
      <ConfirmDialog
        visible={deleteTarget !== null}
        title={t('common.delete')}
        message={deleteTarget ? t('categories.deleteConfirm', { name: deleteTarget.name }) : ''}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) setRemovedIds((prev) => [...prev, deleteTarget.id]);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  actionsWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, alignItems: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  thumb: { width: 44, height: 44, borderRadius: 8 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
