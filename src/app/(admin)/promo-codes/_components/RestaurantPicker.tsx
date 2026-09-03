import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataList } from '@/components/data/DataList';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';

export interface RestaurantPickerProps {
  /** null means "all restaurants". A non-null array (possibly empty) means "specific restaurants". */
  value: string[] | null;
  onChange: (value: string[] | null) => void;
}

/**
 * Bulk restaurant include/exclude control for promo codes: an "All restaurants" vs.
 * "Specific restaurants" toggle, the latter revealing a searchable multi-select sheet
 * over the real restaurants mock. No reusable generic picker existed anywhere in this
 * app (checked src/components/forms and src/components/ui) so this is a promo-codes-local
 * component, following the same chip-toggle + checkbox-row conventions already used by
 * `PricesTab`'s market legend and `RecipientForm`'s channel chips.
 */
export function RestaurantPicker({ value, onChange }: RestaurantPickerProps) {
  const { colors } = useTheme();
  const t = useT();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isSpecific = value !== null;
  const selected = value ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_RESTAURANTS;
    return MOCK_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q));
  }, [query]);

  const toggleRestaurant = (id: string) => {
    const next = selected.includes(id) ? selected.filter((r) => r !== id) : [...selected, id];
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.ink }]}>{t('promoCodes.fieldRestaurants')}</Text>
      <View style={styles.modeRow}>
        <Button variant={!isSpecific ? 'primary' : 'secondary'} size="sm" onPress={() => onChange(null)}>
          {t('promoCodes.allRestaurants')}
        </Button>
        <Button variant={isSpecific ? 'primary' : 'secondary'} size="sm" onPress={() => onChange(selected)}>
          {t('promoCodes.specificRestaurants')}
        </Button>
      </View>

      {isSpecific ? (
        <Pressable
          onPress={() => setSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('promoCodes.selectRestaurants')}
          style={[styles.selectButton, { borderColor: colors.hairline }]}
        >
          <Text style={[text.body, { color: colors.ink }]}>{t('promoCodes.selectRestaurants')}</Text>
          <Text style={[text.caption, { color: selected.length === 0 ? colors.chili : colors.muted }]}>
            {selected.length === 0 ? t('promoCodes.noRestaurantsSelected') : t('promoCodes.restaurantsSelected', { count: selected.length })}
          </Text>
        </Pressable>
      ) : null}

      <Sheet visible={sheetOpen} height="tall" onClose={() => setSheetOpen(false)}>
        <Text style={[styles.sheetTitle, { color: colors.ink }]}>{t('promoCodes.selectRestaurants')}</Text>
        <Input label={t('promoCodes.searchRestaurants')} value={query} onChangeText={setQuery} />
        <View style={styles.bulkRow}>
          <Button variant="ghost" size="sm" onPress={() => onChange(MOCK_RESTAURANTS.map((r) => r.id))}>
            {t('promoCodes.selectAll')}
          </Button>
          <Button variant="ghost" size="sm" onPress={() => onChange([])}>
            {t('promoCodes.clearAll')}
          </Button>
        </View>
        <View style={styles.list}>
          <DataList
            data={filtered}
            keyExtractor={(item) => item.id}
            isLoading={false}
            isEmpty={filtered.length === 0}
            emptyTitle={t('promoCodes.selectRestaurants')}
            emptyMessage=""
            emptyIcon={<Ionicons name="restaurant-outline" size={20} color={colors.leaf} />}
            renderItem={({ item }) => {
              const checked = selected.includes(item.id);
              return (
                <Pressable
                  onPress={() => toggleRestaurant(item.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={item.name}
                  style={styles.row}
                >
                  <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={20} color={colors.leaf} />
                  <Text style={[text.body, { color: colors.ink, flex: 1 }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
        <Button variant="primary" fullWidth onPress={() => setSheetOpen(false)}>
          {t('promoCodes.done')}
        </Button>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  label: { ...text.label },
  modeRow: { flexDirection: 'row', gap: space.sm },
  selectButton: {
    minHeight: hit.min,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    justifyContent: 'center',
    gap: 2,
  },
  sheetTitle: { ...text.h3, marginBottom: space.sm },
  bulkRow: { flexDirection: 'row', gap: space.sm, marginBottom: space.xs },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: hit.min, paddingVertical: space.xs },
});
