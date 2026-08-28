import type { LoanApplication, LoanApplicationStatus, Penalty, VoucherType } from './vouchers';

export type { LoanApplication, LoanApplicationStatus, Penalty, VoucherType };

/**
 * Loan applications (pre-voucher-issuance stage) and penalties, split out
 * of vouchers.ts to stay under the 200-line cap.
 */
export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 'loanapp-001',
    restaurantId: 'rest-005',
    restaurantName: 'Repub Lounge',
    requestedAmount: 400000,
    purpose: 'Working capital for weekend catering orders.',
    status: 'PENDING',
    requestedAt: '2026-08-20T09:00:00Z',
    approvedAmount: null,
    repaymentDays: null,
    voucherType: null,
    rejectionReason: null,
  },
  {
    id: 'loanapp-002',
    restaurantId: 'rest-006',
    restaurantName: 'Meze Fresh',
    requestedAmount: 250000,
    purpose: 'Initial stock for new branch opening.',
    status: 'REJECTED',
    requestedAt: '2026-08-05T10:30:00Z',
    approvedAmount: null,
    repaymentDays: null,
    voucherType: null,
    rejectionReason: 'Restaurant not yet verified — pending onboarding review.',
  },
  {
    id: 'loanapp-003',
    restaurantId: 'rest-015',
    restaurantName: 'Nyamirambo Kitchen',
    requestedAmount: 100000,
    purpose: 'Bridge financing during account suspension review.',
    status: 'APPROVED',
    requestedAt: '2026-07-15T08:00:00Z',
    approvedAmount: 100000,
    repaymentDays: 30,
    voucherType: 'DISCOUNT_10' as VoucherType,
    rejectionReason: null,
  },
];

/** Penalties reference loans by id, cross-referenced with MOCK_VOUCHERS' loanId. */
export const MOCK_PENALTIES: Penalty[] = [
  {
    id: 'pen-001',
    loanId: 'loan-002',
    amount: 24000,
    ratePerMonth: 3,
    daysOverdue: 12,
    waived: false,
    waivedReason: null,
  },
  {
    id: 'pen-002',
    loanId: 'loan-007',
    amount: 15000,
    ratePerMonth: 3,
    daysOverdue: 40,
    waived: true,
    waivedReason: 'Restaurant closed temporarily for renovation — waived by SUPERUSER.',
  },
];
