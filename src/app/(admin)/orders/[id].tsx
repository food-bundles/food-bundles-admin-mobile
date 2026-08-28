import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 7 — Orders. */
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Order {id} — Phase 7</Text>
    </View>
  );
}
