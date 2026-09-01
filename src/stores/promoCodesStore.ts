import { create } from 'zustand';
import { MOCK_PROMO_CODES, type PromoCode } from '@/mocks/promo-codes';

interface PromoCodesState {
  codes: PromoCode[];
  overrides: Record<string, { paused: boolean }>;
  togglePause: (id: string) => void;
  deleteCode: (id: string) => void;
}

/** Session-only pause/resume + delete state layered on the static promo-codes mock. */
export const usePromoCodesStore = create<PromoCodesState>((set) => ({
  codes: MOCK_PROMO_CODES,
  overrides: {},
  togglePause: (id) =>
    set((state) => ({
      overrides: { ...state.overrides, [id]: { paused: !state.overrides[id]?.paused } },
    })),
  deleteCode: (id) => set((state) => ({ codes: state.codes.filter((c) => c.id !== id) })),
}));

export function isPaused(overrides: Record<string, { paused: boolean }>, id: string): boolean {
  return overrides[id]?.paused ?? false;
}
