import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 8 — Users. */
export default function AffiliatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Affiliator {id} — Phase 8</Text>
    </View>
  );
}
