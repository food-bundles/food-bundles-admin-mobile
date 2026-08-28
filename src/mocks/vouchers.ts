export type VoucherType = 'DISCOUNT_10' | 'DISCOUNT_20' | 'DISCOUNT_50' | 'DISCOUNT_80' | 'DISCOUNT_100';
export type VoucherStatus = 'ACTIVE' | 'EXHAUSTED' | 'EXPIRED' | 'DEACTIVATED';
export type LoanApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACCEPTED' | 'DISBURSED';

export interface Voucher {
  id: string;
  restaurantId: string;
  restaurantName: string;
  voucherType: VoucherType;
  creditLimit: number;
  outstandingBalance: number;
  repaymentDays: number;
  status: VoucherStatus;
  createdAt: string;
  expiryDate: string;
  loanId: string | null;
}

export interface LoanApplication {
  id: string;
  restaurantId: string;
  restaurantName: string;
  requestedAmount: number;
  purpose: string;
  status: LoanApplicationStatus;
  requestedAt: string;
  approvedAmount: number | null;
  repaymentDays: number | null;
  voucherType: VoucherType | null;
  rejectionReason: string | null;
}

export interface Penalty {
  id: string;
  loanId: string;
  amount: number;
  ratePerMonth: number;
  daysOverdue: number;
  waived: boolean;
  waivedReason: string | null;
}

/** 10 vouchers, real discount-tier + credit-line model per voucherService.ts. */
export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'vch-001',
    restaurantId: 'rest-001',
    restaurantName: 'Kigali Bistro',
    voucherType: 'DISCOUNT_20',
    creditLimit: 500000,
    outstandingBalance: 120000,
    repaymentDays: 30,
    status: 'ACTIVE',
    createdAt: '2026-06-01T08:00:00Z',
    expiryDate: '2026-12-01T08:00:00Z',
    loanId: 'loan-001',
  },
  {
    id: 'vch-002',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    voucherType: 'DISCOUNT_50',
    creditLimit: 800000,
    outstandingBalance: 800000,
    repaymentDays: 45,
    status: 'ACTIVE',
    createdAt: '2026-05-15T09:00:00Z',
    expiryDate: '2026-11-15T09:00:00Z',
    loanId: 'loan-002',
  },
  {
    id: 'vch-003',
    restaurantId: 'rest-004',
    restaurantName: 'Heaven Restaurant',
    voucherType: 'DISCOUNT_10',
    creditLimit: 300000,
    outstandingBalance: 0,
    repaymentDays: 30,
    status: 'EXHAUSTED',
    createdAt: '2026-04-10T07:30:00Z',
    expiryDate: '2026-10-10T07:30:00Z',
    loanId: 'loan-003',
  },
  {
    id: 'vch-004',
    restaurantId: 'rest-007',
    restaurantName: 'Sole e Luna',
    voucherType: 'DISCOUNT_10',
    creditLimit: 200000,
    outstandingBalance: 45000,
    repaymentDays: 30,
    status: 'ACTIVE',
    createdAt: '2026-07-01T10:00:00Z',
    expiryDate: '2027-01-01T10:00:00Z',
    loanId: 'loan-004',
  },
  {
    id: 'vch-005',
    restaurantId: 'rest-008',
    restaurantName: 'Poivre Noir',
    voucherType: 'DISCOUNT_80',
    creditLimit: 1000000,
    outstandingBalance: 610000,
    repaymentDays: 60,
    status: 'ACTIVE',
    createdAt: '2026-03-20T11:00:00Z',
    expiryDate: '2026-09-20T11:00:00Z',
    loanId: 'loan-005',
  },
  {
    id: 'vch-006',
    restaurantId: 'rest-010',
    restaurantName: 'The Manor',
    voucherType: 'DISCOUNT_100',
    creditLimit: 1500000,
    outstandingBalance: 0,
    repaymentDays: 60,
    status: 'DEACTIVATED',
    createdAt: '2026-02-05T08:00:00Z',
    expiryDate: '2026-08-05T08:00:00Z',
    loanId: 'loan-006',
  },
  {
    id: 'vch-007',
    restaurantId: 'rest-011',
    restaurantName: 'Bourbon Coffee',
    voucherType: 'DISCOUNT_20',
    creditLimit: 250000,
    outstandingBalance: 250000,
    repaymentDays: 30,
    status: 'EXPIRED',
    createdAt: '2026-01-10T09:00:00Z',
    expiryDate: '2026-07-10T09:00:00Z',
    loanId: 'loan-007',
  },
  {
    id: 'vch-008',
    restaurantId: 'rest-012',
    restaurantName: 'Kigali Marriott Kitchen',
    voucherType: 'DISCOUNT_50',
    creditLimit: 2000000,
    outstandingBalance: 850000,
    repaymentDays: 60,
    status: 'ACTIVE',
    createdAt: '2026-06-15T10:00:00Z',
    expiryDate: '2026-12-15T10:00:00Z',
    loanId: 'loan-008',
  },
  {
    id: 'vch-009',
    restaurantId: 'rest-014',
    restaurantName: 'Green Hills Grill',
    voucherType: 'DISCOUNT_10',
    creditLimit: 150000,
    outstandingBalance: 30000,
    repaymentDays: 30,
    status: 'ACTIVE',
    createdAt: '2026-07-20T08:30:00Z',
    expiryDate: '2027-01-20T08:30:00Z',
    loanId: 'loan-009',
  },
  {
    id: 'vch-010',
    restaurantId: 'rest-002',
    restaurantName: 'Imboni',
    voucherType: 'DISCOUNT_20',
    creditLimit: 200000,
    outstandingBalance: 200000,
    repaymentDays: 30,
    status: 'ACTIVE',
    createdAt: '2026-08-01T09:00:00Z',
    expiryDate: '2027-02-01T09:00:00Z',
    loanId: 'loan-010',
  },
];