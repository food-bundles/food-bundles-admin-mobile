import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 9 — Stock. */
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Product {id} — Phase 9</Text>
    </View>
  );
}
