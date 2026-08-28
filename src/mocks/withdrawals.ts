import type { DelegationRecord, Withdrawal, WithdrawalStatus } from './deposits';

export type { DelegationRecord, Withdrawal, WithdrawalStatus };

/**
 * Withdrawals and delegation records, split out of deposits.ts to stay
 * under the 200-line cap.
 */

/** 5 withdrawals: mix of PENDING, APPROVED, REJECTED. */
export const MOCK_WITHDRAWALS: Withdrawal[] = [
  {
    id: 'wd-001',
    walletId: 'wallet-005',
    restaurantId: 'rest-005',
    restaurantName: 'Repub Lounge',
    amount: 16000,
    status: 'APPROVED',
    requestedAt: '2026-08-23T09:00:00Z',
    processedAt: '2026-08-23T14:00:00Z',
  },
  {
    id: 'wd-002',
    walletId: 'wallet-007',
    restaurantId: 'rest-007',
    restaurantName: 'Sole e Luna',
    amount: 44700,
    status: 'APPROVED',
    requestedAt: '2026-08-25T08:00:00Z',
    processedAt: '2026-08-25T11:00:00Z',
  },
  {
    id: 'wd-003',
    walletId: 'wallet-003',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    amount: 100000,
    status: 'PENDING',
    requestedAt: '2026-08-27T10:00:00Z',
    processedAt: null,
  },
  {
    id: 'wd-004',
    walletId: 'wallet-009',
    restaurantId: 'rest-009',
    restaurantName: 'Zen Garden',
    amount: 28000,
    status: 'REJECTED',
    requestedAt: '2026-08-19T07:00:00Z',
    processedAt: '2026-08-19T09:30:00Z',
  },
  {
    id: 'wd-005',
    walletId: 'wallet-012',
    restaurantId: 'rest-012',
    restaurantName: 'Kigali Marriott Kitchen',
    amount: 200000,
    status: 'PENDING',
    requestedAt: '2026-08-27T13:00:00Z',
    processedAt: null,
  },
];

/** 3 delegation records: delegator, delegate, spend cap, daily limit, time window. */
export const MOCK_DELEGATIONS: DelegationRecord[] = [
  {
    id: 'deleg-001',
    delegatorId: 'aff-001',
    delegatorName: 'Claudine Iradukunda',
    delegateId: 'aff-002',
    delegateName: 'Olivier Kagame',
    dailyLimit: 50000,
    cap: 500000,
    timeWindow: '06:00–20:00',
  },
  {
    id: 'deleg-002',
    delegatorId: 'aff-004',
    delegatorName: 'Fabrice Nkusi',
    delegateId: 'aff-005',
    delegateName: 'Beatrice Mukandayisenga',
    dailyLimit: 80000,
    cap: 800000,
    timeWindow: '07:00–19:00',
  },
  {
    id: 'deleg-003',
    delegatorId: 'aff-006',
    delegatorName: 'Yves Rugamba',
    delegateId: 'aff-008',
    delegateName: 'Robert Mugabo',
    dailyLimit: 30000,
    cap: 300000,
    timeWindow: '08:00–18:00',
  },
];
