import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Placeholder. Built out in Phase 11 — Financial. */
export default function WalletDetailScreen() {
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Wallet {walletId} — Phase 11</Text>
    </View>
  );
}
