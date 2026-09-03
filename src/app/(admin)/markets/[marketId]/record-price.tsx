import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { formatRwfNumber } from '@/lib/formatRwf';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_MARKETS } from '@/mocks/markets';
import { COMMODITIES, type CommodityId } from '@/mocks/market-prices';
import { DatePickerField } from '../_components/DatePickerField';

type PriceMode = 'simple' | 'ohlc';
const TODAY = new Date(2026, 7, 29);

/** Record a new price point for one commodity at one market. ADMIN and above only. Appends in-memory only. */
export default function RecordPriceScreen() {
  useRoleGuard('markets');
  const { marketId, productId: initialProductId } = useLocalSearchParams<{ marketId: string; productId?: string }>();
  const { colors } = useTheme();
  const t = useT();
  const market = useMemo(() => MOCK_MARKETS.find((m) => m.id === marketId), [marketId]);
  const initialCommodity = COMMODITIES.find((c) => c.productId === initialProductId)?.id ?? COMMODITIES[0].id;
  const [commodityId, setCommodityId] = useState<CommodityId>(initialCommodity);
  const [mode, setMode] = useState<PriceMode>('simple');
  const [price, setPrice] = useState('');
  const [open, setOpen] = useState('');
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [close, setClose] = useState('');
  const [date, setDate] = useState<Date>(TODAY);
  const [note, setNote] = useState('');
  const [confirmation, setConfirmation] = useState<string | null>(null);

  if (!market) {
    return (
      <AdminScreen title={t('markets.title')}>
        <EmptyState icon={null} title={t('markets.title')} message={t('markets.noRecentPrice')} />
      </AdminScreen>
    );
  }

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const commodityChips: FilterChip[] = COMMODITIES.map((c) => ({ key: c.id, label: c.name }));

  const numeric = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0;
  const closeValue = mode === 'simple' ? numeric(price) : numeric(close);
  const canSubmit = closeValue > 0 && (mode === 'simple' || (numeric(open) > 0 && numeric(high) > 0 && numeric(low) > 0));

  const handleSubmit = () => {
    if (!canSubmit) return;
    // In-memory only: the mock series is not mutated across app restarts, matching
    // the project's "fully mocked, no persistence layer" rule for this action.
    setConfirmation(t('markets.recordConfirmation', { commodity: commodity.name, price: formatRwfNumber(closeValue), market: market.name }));
  };

  return (
    <AdminScreen title={t('markets.recordPriceTitle')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.marketName, { color: colors.ink }]}>{market.name}</Text>

        <View>
          <Text style={[styles.label, { color: colors.ink }]}>{t('markets.fieldCommodity')}</Text>
          <FilterBar chips={commodityChips} activeKey={commodityId} onSelect={(key) => setCommodityId(key as CommodityId)} />
        </View>

        <SegmentedTabs
          items={[
            { key: 'simple', label: t('markets.priceModeSimple') },
            { key: 'ohlc', label: t('markets.priceModeOhlc') },
          ]}
          active={mode}
          onChange={setMode}
        />

        {mode === 'simple' ? (
          <Input label={t('markets.fieldPricePerKg')} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" />
        ) : (
          <View style={styles.ohlcGrid}>
            <View style={styles.ohlcCell}>
              <Input label={t('markets.fieldOpen')} value={open} onChangeText={setOpen} keyboardType="numeric" />
            </View>
            <View style={styles.ohlcCell}>
              <Input label={t('markets.fieldHigh')} value={high} onChangeText={setHigh} keyboardType="numeric" />
            </View>
            <View style={styles.ohlcCell}>
              <Input label={t('markets.fieldLow')} value={low} onChangeText={setLow} keyboardType="numeric" />
            </View>
            <View style={styles.ohlcCell}>
              <Input label={t('markets.fieldClose')} value={close} onChangeText={setClose} keyboardType="numeric" />
            </View>
          </View>
        )}

        <DatePickerField label={t('markets.fieldDate')} value={date} onChange={setDate} />
        <Input label={t('markets.fieldNote')} value={note} onChangeText={setNote} placeholder={t('markets.fieldNote')} />

        {confirmation ? <Text style={[styles.confirmation, { color: colors.ripe }]}>{confirmation}</Text> : null}

        <View style={styles.actions}>
          <Button variant="primary" fullWidth disabled={!canSubmit} onPress={handleSubmit} accessibilityLabel={t('markets.submitPrice')}>
            {t('markets.submitPrice')}
          </Button>
          <Button variant="ghost" fullWidth onPress={() => router.back()}>
            {t('common.back')}
          </Button>
        </View>
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  marketName: { ...text.h2 },
  label: { ...text.label, marginBottom: space.xs },
  ohlcGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  ohlcCell: { width: '47%' },
  confirmation: { ...text.bodySemi },
  actions: { gap: space.sm, marginTop: space.md },
});
