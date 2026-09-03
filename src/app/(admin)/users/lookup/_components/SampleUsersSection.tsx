import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { MOCK_FARMERS } from '@/mocks/farmers';
import { MOCK_AFFILIATORS } from '@/mocks/affiliators';
import { MOCK_ADMIN } from '@/mocks/auth';

interface SampleCard {
  id: string;
  name: string;
  imageUri: string;
  typeLabel: string;
  route: string;
}

function buildSamples(t: (key: 'lookup.roleRestaurant' | 'lookup.roleFarmer' | 'lookup.roleAffiliator' | 'lookup.roleAdmin') => string): SampleCard[] {
  const restaurant = MOCK_RESTAURANTS.find((r) => r.name === 'Kigali Bistro') ?? MOCK_RESTAURANTS[0];
  const farmer = MOCK_FARMERS[0];
  const affiliator = MOCK_AFFILIATORS[0];

  const cards: SampleCard[] = [];
  if (restaurant) {
    cards.push({ id: restaurant.id, name: restaurant.name, imageUri: restaurant.imageUri, typeLabel: t('lookup.roleRestaurant'), route: `/(admin)/users/restaurants/${restaurant.id}` });
  }
  if (farmer) {
    cards.push({ id: farmer.id, name: farmer.name, imageUri: farmer.imageUri, typeLabel: t('lookup.roleFarmer'), route: `/(admin)/users/farmers/${farmer.id}` });
  }
  if (affiliator) {
    cards.push({ id: affiliator.id, name: affiliator.name, imageUri: affiliator.imageUri, typeLabel: t('lookup.roleAffiliator'), route: `/(admin)/users/restaurants/${affiliator.restaurantId}` });
  }
  cards.push({ id: MOCK_ADMIN.id, name: MOCK_ADMIN.name, imageUri: MOCK_ADMIN.avatarUri, typeLabel: t('lookup.roleAdmin'), route: `/(admin)/users/admins/${MOCK_ADMIN.id}` });
  return cards;
}

/** "Sample users to try" — 4 real records from the mock data, tappable straight to their detail screen. */
export function SampleUsersSection() {
  const { colors } = useTheme();
  const t = useT();
  const samples = buildSamples(t);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('lookup.sampleUsersTitle')}</Text>
      {samples.map((sample) => (
        <Card key={sample.id} onPress={() => router.push(sample.route as never)} accessibilityLabel={sample.name}>
          <View style={styles.row}>
            <Image source={{ uri: sample.imageUri }} style={styles.avatar} />
            <Text style={[styles.name, { color: colors.ink }]}>{sample.name}</Text>
            <Badge tone="leaf" label={sample.typeLabel} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  sectionTitle: { ...text.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
  name: { ...text.bodySemi, flex: 1 },
});
