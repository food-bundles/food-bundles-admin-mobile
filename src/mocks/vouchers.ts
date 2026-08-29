/** Single-use voucher status: AVAILABLE can still be redeemed, USED is spent, EXPIRED lapsed unused. */
export type VoucherStatus = 'AVAILABLE' | 'USED' | 'EXPIRED';

/**
 * Voucher = single-use token, NOT a balance. A restaurant can hold multiple
 * vouchers simultaneously up to its creditLimit. Matches the restaurant
 * app's v6/v7 model (src/mocks/types.ts `Voucher`), not the older 16-digit
 * PAN / 8-session-state model described in stale docs — see PROGRESS.md's
 * "Decisions taken autonomously" for the reconciliation note.
 */
export interface Voucher {
  id: string;
  code: string; // "FB-XXXX-XXXX"
  restaurantId: string;
  restaurantName: string;
  amount: number; // RWF
  status: VoucherStatus;
  issuedAt: string;
  expiresAt: string; // 30 days from issue
  orderId: string | null;
  appliedAt: string | null;
}

/**
 * 12 vouchers: 4 AVAILABLE, 5 USED, 3 EXPIRED, across restaurants
 * rest-001..rest-006 (reusing real ids from restaurants.ts). USED vouchers
 * link to a real order id from orders.ts/ordersRecent.ts.
 */
export const MOCK_VOUCHERS: Voucher[] = [
  { id: 'vch-001', code: 'FB-7A2K-9X3P', restaurantId: 'rest-001', restaurantName: 'Kigali Bistro', amount: 45000, status: 'AVAILABLE', issuedAt: '2026-08-10T08:00:00Z', expiresAt: '2026-09-09T08:00:00Z', orderId: null, appliedAt: null },
  { id: 'vch-002', code: 'FB-3M8L-QW1Z', restaurantId: 'rest-002', restaurantName: 'Imboni', amount: 20000, status: 'AVAILABLE', issuedAt: '2026-08-15T09:00:00Z', expiresAt: '2026-09-14T09:00:00Z', orderId: null, appliedAt: null },
  { id: 'vch-003', code: 'FB-5T6Y-N2VB', restaurantId: 'rest-003', restaurantName: 'Laza', amount: 80000, status: 'AVAILABLE', issuedAt: '2026-08-20T10:00:00Z', expiresAt: '2026-09-19T10:00:00Z', orderId: null, appliedAt: null },
  { id: 'vch-004', code: 'FB-9K4J-8HGD', restaurantId: 'rest-004', restaurantName: 'Heaven Restaurant', amount: 10000, status: 'AVAILABLE', issuedAt: '2026-08-25T11:00:00Z', expiresAt: '2026-09-24T11:00:00Z', orderId: null, appliedAt: null },

  { id: 'vch-005', code: 'FB-1PQR-5TUV', restaurantId: 'rest-001', restaurantName: 'Kigali Bistro', amount: 60000, status: 'USED', issuedAt: '2026-07-01T08:00:00Z', expiresAt: '2026-07-31T08:00:00Z', orderId: 'FB-24810', appliedAt: '2026-07-05T12:30:00Z' },
  { id: 'vch-006', code: 'FB-2ABC-6DEF', restaurantId: 'rest-002', restaurantName: 'Imboni', amount: 35000, status: 'USED', issuedAt: '2026-07-10T08:00:00Z', expiresAt: '2026-08-09T08:00:00Z', orderId: 'FB-24812', appliedAt: '2026-07-14T09:15:00Z' },
  { id: 'vch-007', code: 'FB-4GHI-7JKL', restaurantId: 'rest-005', restaurantName: 'Repub Lounge', amount: 25000, status: 'USED', issuedAt: '2026-07-15T08:00:00Z', expiresAt: '2026-08-14T08:00:00Z', orderId: 'FB-24815', appliedAt: '2026-07-18T14:00:00Z' },
  { id: 'vch-008', code: 'FB-8MNO-3PQR', restaurantId: 'rest-006', restaurantName: 'Meze Fresh', amount: 15000, status: 'USED', issuedAt: '2026-06-20T08:00:00Z', expiresAt: '2026-07-20T08:00:00Z', orderId: 'FB-24811', appliedAt: '2026-06-25T10:45:00Z' },
  { id: 'vch-009', code: 'FB-6STU-9VWX', restaurantId: 'rest-003', restaurantName: 'Laza', amount: 70000, status: 'USED', issuedAt: '2026-06-25T08:00:00Z', expiresAt: '2026-07-25T08:00:00Z', orderId: 'FB-24813', appliedAt: '2026-06-29T16:20:00Z' },

  { id: 'vch-010', code: 'FB-0YZA-4BCD', restaurantId: 'rest-004', restaurantName: 'Heaven Restaurant', amount: 30000, status: 'EXPIRED', issuedAt: '2026-05-01T08:00:00Z', expiresAt: '2026-05-31T08:00:00Z', orderId: null, appliedAt: null },
  { id: 'vch-011', code: 'FB-7EFG-2HIJ', restaurantId: 'rest-005', restaurantName: 'Repub Lounge', amount: 18000, status: 'EXPIRED', issuedAt: '2026-05-10T08:00:00Z', expiresAt: '2026-06-09T08:00:00Z', orderId: null, appliedAt: null },
  { id: 'vch-012', code: 'FB-3KLM-8NOP', restaurantId: 'rest-006', restaurantName: 'Meze Fresh', amount: 50000, status: 'EXPIRED', issuedAt: '2026-05-15T08:00:00Z', expiresAt: '2026-06-14T08:00:00Z', orderId: null, appliedAt: null },
];
