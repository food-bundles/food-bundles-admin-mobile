import type { PaymentMethod } from './orders';

export type TransactionType = 'TOP_UP' | 'WITHDRAWAL' | 'ORDER_PAYMENT' | 'REFUND';
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WalletTransaction {
  id: string;
  walletId: string;
  restaurantId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  reference: string;
}

export interface Wallet {
  id: string;
  restaurantId: string;
  restaurantName: string;
  balance: number;
  defaultPaymentMethod: PaymentMethod;
}

export interface Withdrawal {
  id: string;
  walletId: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt: string | null;
}

export interface DelegationRecord {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegateId: string;
  delegateName: string;
  dailyLimit: number;
  cap: number;
  timeWindow: string;
}

const RESTAURANT_IDS = [
  'rest-001', 'rest-002', 'rest-003', 'rest-004', 'rest-005',
  'rest-006', 'rest-007', 'rest-008', 'rest-009', 'rest-010',
  'rest-011', 'rest-012', 'rest-013', 'rest-014', 'rest-015',
];

const RESTAURANT_NAMES: Record<string, string> = {
  'rest-001': 'Kigali Bistro',
  'rest-002': 'Imboni',
  'rest-003': 'Laza',
  'rest-004': 'Heaven Restaurant',
  'rest-005': 'Repub Lounge',
  'rest-006': 'Meze Fresh',
  'rest-007': 'Sole e Luna',
  'rest-008': 'Poivre Noir',
  'rest-009': 'Zen Garden',
  'rest-010': 'The Manor',
  'rest-011': 'Bourbon Coffee',
  'rest-012': 'Kigali Marriott Kitchen',
  'rest-013': 'Fusion Grill',
  'rest-014': 'Green Hills Grill',
  'rest-015': 'Nyamirambo Kitchen',
};

const WALLET_BALANCES: Record<string, number> = {
  'rest-001': 285000, 'rest-002': 62000, 'rest-003': 410000, 'rest-004': 198500,
  'rest-005': 34000, 'rest-006': 0, 'rest-007': 51500, 'rest-008': 152000,
  'rest-009': 28000, 'rest-010': 320000, 'rest-011': 41200, 'rest-012': 512000,
  'rest-013': 0, 'rest-014': 19500, 'rest-015': 8700,
};

const DEFAULT_METHODS: PaymentMethod[] = ['MOBILE_MONEY', 'CARD', 'BANK_TRANSFER', 'CASH', 'VOUCHER'];

/** 15 wallets, one per restaurant, balances matching restaurants.ts exactly. */
export const MOCK_WALLETS: Wallet[] = RESTAURANT_IDS.map((restaurantId, i) => ({
  id: `wallet-${String(i + 1).padStart(3, '0')}`,
  restaurantId,
  restaurantName: RESTAURANT_NAMES[restaurantId],
  balance: WALLET_BALANCES[restaurantId],
  defaultPaymentMethod: DEFAULT_METHODS[i % DEFAULT_METHODS.length],
}));

function tx(
  index: number,
  walletId: string,
  restaurantId: string,
  type: TransactionType,
  amount: number,
  balanceAfter: number,
  daysAgo: number,
): WalletTransaction {
  const date = new Date(2026, 7, 27 - daysAgo).toISOString();
  return {
    id: `txn-${String(index).padStart(3, '0')}`,
    walletId,
    restaurantId,
    type,
    amount,
    balanceAfter,
    createdAt: date,
    reference: `REF-${1000 + index}`,
  };
}

/** 20 transactions: mix of TOP_UP, WITHDRAWAL, ORDER_PAYMENT, REFUND. Opening balance + sum = current balance. */
export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  tx(1, 'wallet-001', 'rest-001', 'TOP_UP', 150000, 150000, 20),
  tx(2, 'wallet-001', 'rest-001', 'ORDER_PAYMENT', -49600, 100400, 15),
  tx(3, 'wallet-001', 'rest-001', 'TOP_UP', 200000, 300400, 10),
  tx(4, 'wallet-001', 'rest-001', 'ORDER_PAYMENT', -15400, 285000, 5),
  tx(5, 'wallet-002', 'rest-002', 'TOP_UP', 80000, 80000, 18),
  tx(6, 'wallet-002', 'rest-002', 'ORDER_PAYMENT', -19000, 61000, 12),
  tx(7, 'wallet-002', 'rest-002', 'TOP_UP', 1000, 62000, 3),
  tx(8, 'wallet-003', 'rest-003', 'TOP_UP', 300000, 300000, 25),
  tx(9, 'wallet-003', 'rest-003', 'TOP_UP', 150000, 450000, 14),
  tx(10, 'wallet-003', 'rest-003', 'ORDER_PAYMENT', -40000, 410000, 6),
  tx(11, 'wallet-004', 'rest-004', 'TOP_UP', 220000, 220000, 22),
  tx(12, 'wallet-004', 'rest-004', 'ORDER_PAYMENT', -21500, 198500, 8),
  tx(13, 'wallet-005', 'rest-005', 'TOP_UP', 50000, 50000, 16),
  tx(14, 'wallet-005', 'rest-005', 'WITHDRAWAL', -16000, 34000, 4),
  tx(15, 'wallet-007', 'rest-007', 'TOP_UP', 74000, 74000, 19),
  tx(16, 'wallet-007', 'rest-007', 'REFUND', 22200, 96200, 11),
  tx(17, 'wallet-007', 'rest-007', 'WITHDRAWAL', -44700, 51500, 2),
  tx(18, 'wallet-008', 'rest-008', 'TOP_UP', 200000, 200000, 21),
  tx(19, 'wallet-008', 'rest-008', 'ORDER_PAYMENT', -48000, 152000, 9),
  tx(20, 'wallet-012', 'rest-012', 'TOP_UP', 512000, 512000, 30),
];

/** 5 withdrawals: mix of PENDING, APPROVED, REJECTED. */
// MOCK_WITHDRAWALS and MOCK_DELEGATIONS moved to withdrawals.ts (200-line cap).
