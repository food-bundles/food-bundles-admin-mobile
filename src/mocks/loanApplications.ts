import type { DataConsentSource } from '@/lib/creditScoring';
import { ALL_CONSENT_SOURCES, computeWeightedScore, type CreditTier } from '@/lib/creditScoring';

export type LoanApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface ConsentRecord {
  source: DataConsentSource;
  granted: boolean;
  grantedAt: string | null;
  expiresAt: string | null; // null with granted:true means "forever" (remembered)
}

export interface LoanQuestionnaire {
  purpose: string;
  orderingFrequency: string;
  preferredRepaymentDays: number;
}

export interface LoanApplication {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tin: string;
  phone: string;
  district: string;
  requestedAmount: number;
  verifiedAvgMonthlySales: number;
  currentExposure: number;
  status: LoanApplicationStatus;
  submittedAt: string;
  consent: ConsentRecord[];
  questionnaire: LoanQuestionnaire;
  scoreTier: CreditTier | null;
  approvedLimit: number | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
}

function consentFor(granted: DataConsentSource[], remembered: DataConsentSource[] = []): ConsentRecord[] {
  return ALL_CONSENT_SOURCES.map((source) => {
    if (source === 'foodbundles') {
      return { source, granted: true, grantedAt: '2025-01-01T00:00:00Z', expiresAt: null };
    }
    if (!granted.includes(source)) {
      return { source, granted: false, grantedAt: null, expiresAt: null };
    }
    const forever = remembered.includes(source);
    return {
      source,
      granted: true,
      grantedAt: '2026-07-20T09:00:00Z',
      expiresAt: forever ? null : '2026-08-19T09:00:00Z',
    };
  });
}

/**
 * 4 loan applications: 1 PENDING, 1 APPROVED, 1 REJECTED, 1 UNDER_REVIEW.
 * scoreTier/approvedLimit are computed from the weighted composite score
 * over granted consent sources, matching computeWeightedScore + the
 * TIER_MULTIPLIER × verifiedAvgMonthlySales − currentExposure formula.
 */
export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 'loanapp-001',
    restaurantId: 'rest-005',
    restaurantName: 'Repub Lounge',
    tin: '104332198',
    phone: '+250788556677',
    district: 'Gasabo',
    requestedAmount: 150000,
    verifiedAvgMonthlySales: 210000,
    currentExposure: 25000,
    status: 'PENDING',
    submittedAt: '2026-08-25T09:00:00Z',
    consent: consentFor(['rra', 'vubaVuba', 'foodbundles'], ['rra']),
    questionnaire: {
      purpose: 'Working capital for weekend catering orders.',
      orderingFrequency: '3-4 times per week',
      preferredRepaymentDays: 30,
    },
    scoreTier: null,
    approvedLimit: null,
    rejectionReason: null,
    reviewedAt: null,
  },
  {
    id: 'loanapp-002',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    tin: '104991284',
    phone: '+250788334455',
    district: 'Gasabo',
    requestedAmount: 400000,
    verifiedAvgMonthlySales: 320000,
    currentExposure: 70000,
    status: 'APPROVED',
    submittedAt: '2026-08-01T08:00:00Z',
    consent: consentFor(['rra', 'eucl', 'vubaVuba', 'kayko', 'creditBureau', 'foodbundles'], ['rra', 'kayko']),
    questionnaire: {
      purpose: 'Bulk stock purchase ahead of a catering contract.',
      orderingFrequency: 'Daily',
      preferredRepaymentDays: 45,
    },
    scoreTier: 'A',
    approvedLimit: 26000,
    rejectionReason: null,
    reviewedAt: '2026-08-03T10:30:00Z',
  },
  {
    id: 'loanapp-003',
    restaurantId: 'rest-006',
    restaurantName: 'Meze Fresh',
    tin: '104112837',
    phone: '+250788667788',
    district: 'Gasabo',
    requestedAmount: 250000,
    verifiedAvgMonthlySales: 45000,
    currentExposure: 0,
    status: 'REJECTED',
    submittedAt: '2026-07-28T10:00:00Z',
    consent: consentFor(['foodbundles']),
    questionnaire: {
      purpose: 'Initial stock for new branch opening.',
      orderingFrequency: 'New account — no history yet',
      preferredRepaymentDays: 30,
    },
    scoreTier: 'D',
    approvedLimit: null,
    rejectionReason: 'Verified average monthly sales too low to qualify at the requested amount, and no third-party data sources authorized.',
    reviewedAt: '2026-07-29T11:00:00Z',
  },
  {
    id: 'loanapp-004',
    restaurantId: 'rest-007',
    restaurantName: 'Sole e Luna',
    tin: '104887623',
    phone: '+250788778899',
    district: 'Gasabo',
    requestedAmount: 90000,
    verifiedAvgMonthlySales: 130000,
    currentExposure: 15000,
    status: 'UNDER_REVIEW',
    submittedAt: '2026-08-27T14:00:00Z',
    consent: consentFor(['vubaVuba', 'eucl', 'foodbundles']),
    questionnaire: {
      purpose: 'Restock produce ahead of a public holiday weekend.',
      orderingFrequency: '2-3 times per week',
      preferredRepaymentDays: 30,
    },
    scoreTier: null,
    approvedLimit: null,
    rejectionReason: null,
    reviewedAt: null,
  },
];

export { computeWeightedScore };
