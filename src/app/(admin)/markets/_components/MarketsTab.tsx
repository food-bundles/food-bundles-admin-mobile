import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_MARKETS, type Market } from '@/mocks/markets';
import { MarketSheet } from './MarketSheet';

const CAN_EDIT_ROLES = ['SUPERUSER', 'ADMIN'];

/** Exact per-market thumbnails specified for the Markets tab. */
const MARKET_IMAGE: Record<string, string> = {
  'mkt-001': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=112',
  'mkt-002': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=112',
  'mkt-003': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=112',
  'mkt-004': 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=112',
  'mkt-005': 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=112',
};

/** List of markets + edit/delete (ADMIN+) + "Add market". */
export function MarketsTab() {
  const { colors } = useTheme();
  const t = useT();
  const role = useAuthStore((state) => state.user?.role);
  const canEdit = role ? CAN_EDIT_ROLES.includes(role) : false;
  const [extra, setExtra] = useState<Market[]>([]);
  const [editTarget, setEditTarget] = useState<Market | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Market | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const markets = [...MOCK_MARKETS, ...extra].filter((m) => !removedIds.includes(m.id));

  return (
    <View style={styles.container}>
      {canEdit ? (
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            setEditTarget(null);
            setSheetOpen(true);
          }}
        >
          {t('markets.addMarket')}
        </Button>
      ) : null}
      {markets.map((market) => (
        <Card key={market.id} accessibilityLabel={market.name}>
          <View style={styles.row}>
            <Image
              source={{ uri: MARKET_IMAGE[market.id] ?? MARKET_IMAGE['mkt-005'] }}
              style={styles.logo}
              accessibilityLabel={market.name}
            />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{market.name}</Text>
              <Text style={[styles.detail, { color: colors.muted }]}>
                {market.location} · {market.district}
              </Text>
            </View>
            {market.isOwn ? <Badge tone="leaf" label="FoodBundles" /> : null}
          </View>
          {canEdit ? (
            <View style={styles.actionsRow}>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setEditTarget(market);
                  setSheetOpen(true);
                }}
              >
                {t('markets.edit')}
              </Button>
              {!market.isOwn ? (
                <Button variant="ghost" size="sm" onPress={() => setDeleteTarget(market)}>
                  {t('common.delete')}
                </Button>
              ) : null}
            </View>
          ) : null}
        </Card>
      ))}

      <MarketSheet
        visible={sheetOpen}
        initial={editTarget ?? undefined}
        onClose={() => setSheetOpen(false)}
        onSave={(name, location, district) => {
          if (editTarget) {
            setExtra((prev) => prev.map((m) => (m.id === editTarget.id ? { ...m, name, location, district } : m)));
          } else {
            setExtra((prev) => [...prev, { id: `mkt-${Date.now()}`, name, location, district, isOwn: false }]);
          }
        }}
      />
      <ConfirmDialog
        visible={deleteTarget !== null}
        title={t('common.delete')}
        message={deleteTarget ? t('markets.deleteConfirm', { name: deleteTarget.name }) : ''}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) setRemovedIds((prev) => [...prev, deleteTarget.id]);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, justifyContent: 'space-between' },
  logo: { width: 56, height: 56, borderRadius: radius.md },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
});
