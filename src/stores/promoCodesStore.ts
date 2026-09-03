import { create } from 'zustand';
import { MOCK_PROMO_CODES, type PromoCode } from '@/mocks/promo-codes';

export type NewPromoCode = Omit<PromoCode, 'id' | 'usedCount' | 'expiresAt'> & { expiresAt?: string };

interface PromoCodesState {
  codes: PromoCode[];
  overrides: Record<string, { paused: boolean }>;
  togglePause: (id: string) => void;
  deleteCode: (id: string) => void;
  addCode: (draft: NewPromoCode) => PromoCode;
  updateCode: (id: string, patch: Partial<PromoCode>) => void;
}

/** Session-only pause/resume + delete + create/update state layered on the static promo-codes mock. */
export const usePromoCodesStore = create<PromoCodesState>((set) => ({
  codes: MOCK_PROMO_CODES,
  overrides: {},
  togglePause: (id) =>
    set((state) => ({
      overrides: { ...state.overrides, [id]: { paused: !state.overrides[id]?.paused } },
    })),
  deleteCode: (id) => set((state) => ({ codes: state.codes.filter((c) => c.id !== id) })),
  addCode: (draft) => {
    const code: PromoCode = {
      ...draft,
      id: `promo-${Date.now()}`,
      usedCount: 0,
      expiresAt: draft.expiresAt ?? new Date(Date.now() + 30 * 86_400_000).toISOString(),
    };
    set((state) => ({ codes: [code, ...state.codes] }));
    return code;
  },
  updateCode: (id, patch) =>
    set((state) => ({ codes: state.codes.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
}));

export function isPaused(overrides: Record<string, { paused: boolean }>, id: string): boolean {
  return overrides[id]?.paused ?? false;
}
