import { Stack } from 'expo-router';

/** Stack navigator for unauthenticated screens (login, 2FA). No drawer shell. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
