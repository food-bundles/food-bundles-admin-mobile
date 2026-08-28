import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

/** Root entry redirect: dashboard if signed in, login otherwise. */
export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(admin)/dashboard' : '/(auth)/login'} />;
}
