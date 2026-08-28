import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 11 — Financial. */
export default function VoucherDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Voucher {id} — Phase 11</Text>
    </View>
  );
}
