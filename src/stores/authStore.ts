import { create } from 'zustand';
import type { AdminUser } from '@/types/auth';

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  signIn: (user: AdminUser) => void;
  signOut: () => void;
}

/**
 * Session state only — no persistence yet. Phase 5 (Auth) wires this to the
 * mock login/2FA flow and decides whether the session survives app restart.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  signIn: (user) => set({ user, isAuthenticated: true }),
  signOut: () => set({ user: null, isAuthenticated: false }),
}));
