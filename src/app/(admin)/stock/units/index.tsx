import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_UNITS, type Unit } from '@/mocks/units';
import { UnitSheet } from './_components/UnitSheet';

/** Unit list + add/delete. Built from stock/units/page.tsx. */
export default function UnitsScreen() {
  useRoleGuard('stock');
  const { colors } = useTheme();
  const t = useT();
  const [extra, setExtra] = useState<Unit[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const units = [...MOCK_UNITS, ...extra].filter((u) => !removedIds.includes(u.id));

  return (
    <AdminScreen title={t('units.title')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" size="sm" onPress={() => setSheetOpen(true)}>
          {t('units.create')}
        </Button>
      </View>
      <DataList
        data={units}
        renderItem={({ item }) => (
          <Card accessibilityLabel={item.name}>
            <View style={styles.row}>
              <Badge tone="leaf" label={item.abbreviation} />
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
                <Text style={[styles.detail, { color: colors.muted }]}>{t('units.productCount', { count: item.productCount })}</Text>
              </View>
              <Button variant="ghost" size="sm" onPress={() => setDeleteTarget(item)}>
                {t('common.delete')}
              </Button>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={units.length === 0}
        emptyTitle={t('units.emptyTitle')}
        emptyMessage={t('units.emptyMessage')}
        emptyIcon={<Ionicons name="resize-outline" size={20} color={colors.leaf} />}
      />
      <UnitSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(name, abbreviation) => setExtra((prev) => [...prev, { id: `unit-${Date.now()}`, name, abbreviation, productCount: 0 }])}
      />
      <ConfirmDialog
        visible={deleteTarget !== null}
        title={t('common.delete')}
        message={deleteTarget ? t('units.deleteConfirm', { name: deleteTarget.name }) : ''}
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
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
