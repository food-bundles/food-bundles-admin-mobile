import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 12 — Operations. */
export default function PromoCodeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Promo code {id} — Phase 12</Text>
    </View>
  );
}
