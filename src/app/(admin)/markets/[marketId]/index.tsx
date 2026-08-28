import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 10 — Markets. */
export default function MarketDetailScreen() {
  const { marketId } = useLocalSearchParams<{ marketId: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Market {marketId} — Phase 10</Text>
    </View>
  );
}
