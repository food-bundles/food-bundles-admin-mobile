import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { BarChart } from '@/components/charts/BarChart';
import { usePromoCodesStore, isPaused } from '@/stores/promoCodesStore';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { MOCK_ORDERS } from '@/mocks/orders';
import type { PromoCode } from '@/mocks/promo-codes';

export interface PromoCodeDetailSheetProps {
  code: PromoCode | null;
  onClose: () => void;
}

/** Detail sheet: all fields, usage history (last 5 mock uses), Pause/Resume/Delete, 7-day usage BarChart. */
export function PromoCodeDetailSheet({ code, onClose }: PromoCodeDetailSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const overrides = usePromoCodesStore((state) => state.overrides);
  const togglePause = usePromoCodesStore((state) => state.togglePause);
  const deleteCode = usePromoCodesStore((state) => state.deleteCode);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const paused = code ? isPaused(overrides, code.id) : false;
  const usageHistory = code
    ? Array.from({ length: Math.min(5, code.usedCount) }, (_, i) => ({
        restaurant: MOCK_RESTAURANTS[i % MOCK_RESTAURANTS.length]?.name ?? '',
        order: MOCK_ORDERS[i % MOCK_ORDERS.length]?.id ?? '',
        date: MOCK_ORDERS[i % MOCK_ORDERS.length]?.createdAt ?? new Date().toISOString(),
      }))
    : [];
  const usageByDay = Array.from({ length: 7 }, (_, x) => ({ x, y: code ? Math.round((code.usedCount / 7) * (0.5 + Math.random())) : 0 }));

  return (
    <Sheet visible={code !== null} height="tall" onClose={onClose}>
      {code ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.ink }]}>{code.code}</Text>
          <Row label={t('promoCodes.fieldType')} value={code.type} />
          <Row label={t('promoCodes.fieldValue')} value={code.type === 'PERCENT' ? `${code.value}%` : formatRwf(code.value)} />
          <Row label={t('promoCodes.fieldMinOrder')} value={formatRwf(code.minOrder)} />
          <Row label={t('promoCodes.uses', { used: code.usedCount, max: code.maxUses })} value="" />
          <Row label={t('promoCodes.fieldExpiry')} value={formatDate(code.expiresAt, language)} />
          <Row
            label={t('promoCodes.fieldRestaurants')}
            value={code.restaurantIds === null ? t('promoCodes.allRestaurants') : t('promoCodes.restaurantsSelected', { count: code.restaurantIds.length })}
          />

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('promoCodes.usageAnalytics')}</Text>
          <BarChart data={usageByDay} colorKey="leaf" height={120} />

          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('promoCodes.usageHistory')}</Text>
          {usageHistory.length === 0 ? (
            <Text style={[styles.body, { color: colors.muted }]}>{t('promoCodes.noUsage')}</Text>
          ) : (
            usageHistory.map((entry, index) => (
              <Text key={`${entry.order}-${index}`} style={[styles.body, { color: colors.body }]}>
                {entry.restaurant} · {entry.order} · {formatDate(entry.date, language)}
              </Text>
            ))
          )}

          <View style={styles.actionsRow}>
            <View style={styles.actionSlot}>
              <Button variant="secondary" fullWidth onPress={() => togglePause(code.id)}>
                {t(paused ? 'promoCodes.resume' : 'promoCodes.pause')}
              </Button>
            </View>
            <View style={styles.actionSlot}>
              <Button variant="ghost" fullWidth onPress={() => { onClose(); router.push(`/(admin)/promo-codes/${code.id}`); }}>
                {t('common.save')}
              </Button>
            </View>
          </View>
          <Button variant="destructive" fullWidth onPress={() => setConfirmDelete(true)}>
            {t('common.delete')}
          </Button>

          <ConfirmDialog
            visible={confirmDelete}
            title={t('common.delete')}
            message={code.code}
            confirmLabel={t('common.delete')}
            variant="danger"
            onConfirm={() => {
              deleteCode(code.id);
              setConfirmDelete(false);
              onClose();
            }}
            onCancel={() => setConfirmDelete(false)}
          />
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      {value ? <Text style={[styles.rowValue, { color: colors.ink }]}>{value}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2, fontFamily: 'IBMPlexSans_600SemiBold', letterSpacing: 0.5, marginBottom: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.xs },
  rowLabel: { ...text.body },
  rowValue: { ...text.bodySemi },
  sectionTitle: { ...text.h3, marginTop: space.md, marginBottom: space.sm },
  body: { ...text.body, marginBottom: space.xs },
  actionsRow: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  actionSlot: { flex: 1 },
});
