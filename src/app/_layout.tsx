import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import * as SplashScreen from 'expo-splash-screen';
import { hydrateTheme, useTheme } from '@/theme';
import { hydrateLanguage } from '@/i18n';
import { InAppBannerHost } from '@/components/notifications/InAppBannerHost';
import { AppSplash } from './splash';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Root layout: font loading, theme, branded boot splash, and the two top-level route groups. */
export default function RootLayout() {
  const { isDark } = useTheme();
  const [showBrandSplash, setShowBrandSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
  });

  useEffect(() => {
    hydrateTheme().catch(() => undefined);
    hydrateLanguage().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="splash" />
      </Stack>
      <InAppBannerHost />
      {showBrandSplash ? <AppSplash onFinish={() => setShowBrandSplash(false)} /> : null}
    </GestureHandlerRootView>
  );
}
