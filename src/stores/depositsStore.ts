import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_WALLETS, MOCK_TRANSACTIONS, type Wallet, type WalletTransaction } from '@/mocks/deposits';
import { MOCK_WITHDRAWALS, type Withdrawal, type WithdrawalStatus } from '@/mocks/withdrawals';
import type { PaymentMethod } from '@/mocks/orders';

interface DepositsState {
  wallets: Wallet[];
  transactions: WalletTransaction[];
  withdrawals: Withdrawal[];
  topUp: (walletId: string, amount: number, method: PaymentMethod) => void;
  setWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
}

/** Session-only mutable wallet/transaction/withdrawal state, seeded from the mocks. */
export const useDepositsStore = create<DepositsState>((set) => ({
  wallets: MOCK_WALLETS,
  transactions: MOCK_TRANSACTIONS,
  withdrawals: MOCK_WITHDRAWALS,
  topUp: (walletId, amount, method) =>
    set((state) => {
      const wallet = state.wallets.find((w) => w.id === walletId);
      if (!wallet) return state;
      const newBalance = wallet.balance + amount;
      const tx: WalletTransaction = {
        id: generateId('tx'),
        walletId,
        restaurantId: wallet.restaurantId,
        type: 'TOP_UP',
        amount,
        balanceAfter: newBalance,
        createdAt: new Date().toISOString(),
        reference: `TOPUP-${method}`,
      };
      return {
        wallets: state.wallets.map((w) => (w.id === walletId ? { ...w, balance: newBalance } : w)),
        transactions: [tx, ...state.transactions],
      };
    }),
  setWithdrawalStatus: (id, status) =>
    set((state) => ({
      withdrawals: state.withdrawals.map((w) => (w.id === id ? { ...w, status, processedAt: new Date().toISOString() } : w)),
    })),
}));
