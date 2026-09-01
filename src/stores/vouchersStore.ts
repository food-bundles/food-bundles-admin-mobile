import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_VOUCHERS, type Voucher } from '@/mocks/vouchers';

export interface CreateVoucherInput {
  restaurantId: string;
  restaurantName: string;
  amount: number;
}

interface VouchersState {
  vouchers: Voucher[];
  createVoucher: (input: CreateVoucherInput) => Voucher;
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FB-${part()}-${part()}`;
}

/** Session-only mutable voucher state seeded from MOCK_VOUCHERS, so "Create voucher on behalf" actually adds one. */
export const useVouchersStore = create<VouchersState>((set) => ({
  vouchers: MOCK_VOUCHERS,
  createVoucher: (input) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(now.getDate() + 30);
    const voucher: Voucher = {
      id: generateId('vch'),
      code: randomCode(),
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      amount: input.amount,
      status: 'AVAILABLE',
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      orderId: null,
      appliedAt: null,
    };
    set((state) => ({ vouchers: [voucher, ...state.vouchers] }));
    return voucher;
  },
}));
