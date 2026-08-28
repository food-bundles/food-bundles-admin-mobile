import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { AdminShell } from '@/components/layout/AdminShell';

/**
 * Layout for all authenticated admin screens: the drawer shell plus the
 * auth guard. Redirects to login if there is no active session — every
 * screen under (admin)/ assumes `useAuthStore().user` is non-null.
 */
export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/(auth)/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <AdminShell />;
}
