import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * Root layout for the FoodBundles Admin app.
 * Phase 0 placeholder: font loading, theming, i18n and store providers
 * are added in later phases as those modules are built.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
