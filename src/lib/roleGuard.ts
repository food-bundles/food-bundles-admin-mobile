import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import type { AdminRole } from '@/types/auth';

/**
 * Section keys used by both the drawer's role gating and useRoleGuard.
 * Maps to the real 5-role model: SUPERUSER gates admin management + system
 * settings; ADMIN manages everything operational; AGGREGATOR/LOGISTICS get
 * read access to markets+stock / orders respectively; TRADER is scoped to
 * financial/voucher flows.
 */
export type AccessSection =
  | 'dashboard'
  | 'orders'
  | 'usersRestaurants'
  | 'usersFarmers'
  | 'usersAffiliators'
  | 'usersAdmins'
  | 'usersLookup'
  | 'stock'
  | 'markets'
  | 'financial'
  | 'operations'
  | 'settings';

const SECTION_ROLES: Record<AccessSection, AdminRole[]> = {
  dashboard: ['SUPERUSER', 'ADMIN', 'AGGREGATOR', 'LOGISTICS', 'TRADER'],
  orders: ['SUPERUSER', 'ADMIN', 'LOGISTICS'],
  usersRestaurants: ['SUPERUSER', 'ADMIN'],
  usersFarmers: ['SUPERUSER', 'ADMIN'],
  usersAffiliators: ['SUPERUSER', 'ADMIN'],
  usersAdmins: ['SUPERUSER'],
  usersLookup: ['SUPERUSER', 'ADMIN'],
  stock: ['SUPERUSER', 'ADMIN', 'AGGREGATOR'],
  markets: ['SUPERUSER', 'ADMIN', 'AGGREGATOR'],
  financial: ['SUPERUSER', 'ADMIN', 'TRADER'],
  operations: ['SUPERUSER', 'ADMIN'],
  settings: ['SUPERUSER'],
};

export function canAccess(role: AdminRole, section: AccessSection): boolean {
  return SECTION_ROLES[section].includes(role);
}

/** Redirects to the dashboard if the signed-in admin lacks access to `section`. */
export function useRoleGuard(section: AccessSection): void {
  const role = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    if (role && !canAccess(role, section)) {
      router.replace('/(admin)/dashboard');
    }
  }, [role, section]);
}
