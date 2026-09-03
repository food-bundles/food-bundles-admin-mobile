import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';

export interface SelectRestaurantStepProps {
  value: Restaurant | null;
  onSelect: (restaurant: Restaurant) => void;
}

/** Step 1: searchable restaurant list for the create-on-behalf wizard. */
export function SelectRestaurantStep({ value, onSelect }: SelectRestaurantStepProps) {
  const { colors } = useTheme();
  const t = useT();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_RESTAURANTS;
    return MOCK_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q) || r.district.toLowerCase().includes(q));
  }, [search]);

  return (
    <View style={styles.container}>
      <Input label={t('orderBehalf.searchRestaurant')} value={search} onChangeText={setSearch} />
      {filtered.map((restaurant) => {
        const selected = value?.id === restaurant.id;
        return (
          <Pressable
            key={restaurant.id}
            onPress={() => onSelect(restaurant)}
            accessibilityRole="button"
            accessibilityLabel={restaurant.name}
            accessibilityState={{ selected }}
            style={[styles.row, { borderColor: selected ? colors.leaf : colors.hairline }]}
          >
            <Image source={{ uri: restaurant.imageUri }} style={styles.logo} />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{restaurant.name}</Text>
              <Text style={[styles.district, { color: colors.muted }]}>{restaurant.district}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.sm, borderWidth: 1.5, borderRadius: 12 },
  logo: { width: 40, height: 40, borderRadius: 20 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  district: { ...text.caption },
});
