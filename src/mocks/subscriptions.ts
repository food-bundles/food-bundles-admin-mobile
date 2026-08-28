import type { PaymentMethod } from './orders';

export type BillingCycle = 'WEEKLY' | 'MONTHLY';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface SubscriptionPlan {
  id: string;
  name: 'Basic' | 'Premium';
  monthlyPrice: number;
  weeklyPrice: number;
}

export interface RestaurantSubscription {
  id: string;
  restaurantId: string;
  restaurantName: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  nextBillingDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

/** 2 plans: Basic 20,000 RWF/mo · 14,000 RWF/wk, Premium 100,000 RWF/mo · 70,000 RWF/wk. */
export const MOCK_PLANS: SubscriptionPlan[] = [
  { id: 'plan-basic', name: 'Basic', monthlyPrice: 20000, weeklyPrice: 14000 },
  { id: 'plan-premium', name: 'Premium', monthlyPrice: 100000, weeklyPrice: 70000 },
];

/** 12 restaurant subscriptions, cross-referencing restaurants.ts and matching their subscription tier. */
export const MOCK_SUBSCRIPTIONS: RestaurantSubscription[] = [
  {
    id: 'sub-001',
    restaurantId: 'rest-001',
    restaurantName: 'Kigali Bistro',
    planId: 'plan-premium',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-01-15T08:00:00Z',
    nextBillingDate: '2026-09-15T08:00:00Z',
    amount: 100000,
    paymentMethod: 'MOBILE_MONEY',
  },
  {
    id: 'sub-002',
    restaurantId: 'rest-002',
    restaurantName: 'Imboni',
    planId: 'plan-basic',
    status: 'ACTIVE',
    billingCycle: 'WEEKLY',
    startDate: '2025-01-22T09:30:00Z',
    nextBillingDate: '2026-09-02T09:30:00Z',
    amount: 14000,
    paymentMethod: 'CARD',
  },
  {
    id: 'sub-003',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    planId: 'plan-premium',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-02-03T07:45:00Z',
    nextBillingDate: '2026-09-03T07:45:00Z',
    amount: 100000,
    paymentMethod: 'BANK_TRANSFER',
  },
  {
    id: 'sub-004',
    restaurantId: 'rest-004',
    restaurantName: 'Heaven Restaurant',
    planId: 'plan-premium',
    status: 'PAST_DUE',
    billingCycle: 'MONTHLY',
    startDate: '2025-02-10T10:15:00Z',
    nextBillingDate: '2026-08-10T10:15:00Z',
    amount: 100000,
    paymentMethod: 'MOBILE_MONEY',
  },
  {
    id: 'sub-005',
    restaurantId: 'rest-005',
    restaurantName: 'Repub Lounge',
    planId: 'plan-basic',
    status: 'ACTIVE',
    billingCycle: 'WEEKLY',
    startDate: '2025-02-18T12:00:00Z',
    nextBillingDate: '2026-09-04T12:00:00Z',
    amount: 14000,
    paymentMethod: 'CASH',
  },
  {
    id: 'sub-006',
    restaurantId: 'rest-007',
    restaurantName: 'Sole e Luna',
    planId: 'plan-basic',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-03-05T09:00:00Z',
    nextBillingDate: '2026-09-05T09:00:00Z',
    amount: 20000,
    paymentMethod: 'MOBILE_MONEY',
  },
  {
    id: 'sub-007',
    restaurantId: 'rest-008',
    restaurantName: 'Poivre Noir',
    planId: 'plan-premium',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-03-11T11:30:00Z',
    nextBillingDate: '2026-09-11T11:30:00Z',
    amount: 100000,
    paymentMethod: 'CARD',
  },
  {
    id: 'sub-008',
    restaurantId: 'rest-009',
    restaurantName: 'Zen Garden',
    planId: 'plan-basic',
    status: 'CANCELLED',
    billingCycle: 'MONTHLY',
    startDate: '2025-03-19T08:45:00Z',
    nextBillingDate: '2025-07-19T08:45:00Z',
    amount: 20000,
    paymentMethod: 'CASH',
  },
  {
    id: 'sub-009',
    restaurantId: 'rest-010',
    restaurantName: 'The Manor',
    planId: 'plan-premium',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-04-02T13:10:00Z',
    nextBillingDate: '2026-09-02T13:10:00Z',
    amount: 100000,
    paymentMethod: 'BANK_TRANSFER',
  },
  {
    id: 'sub-010',
    restaurantId: 'rest-011',
    restaurantName: 'Bourbon Coffee',
    planId: 'plan-basic',
    status: 'ACTIVE',
    billingCycle: 'WEEKLY',
    startDate: '2025-04-14T07:20:00Z',
    nextBillingDate: '2026-09-01T07:20:00Z',
    amount: 14000,
    paymentMethod: 'MOBILE_MONEY',
  },
  {
    id: 'sub-011',
    restaurantId: 'rest-012',
    restaurantName: 'Kigali Marriott Kitchen',
    planId: 'plan-premium',
    status: 'ACTIVE',
    billingCycle: 'MONTHLY',
    startDate: '2025-04-22T10:00:00Z',
    nextBillingDate: '2026-09-22T10:00:00Z',
    amount: 100000,
    paymentMethod: 'BANK_TRANSFER',
  },
  {
    id: 'sub-012',
    restaurantId: 'rest-014',
    restaurantName: 'Green Hills Grill',
    planId: 'plan-basic',
    status: 'ACTIVE',
    billingCycle: 'WEEKLY',
    startDate: '2025-05-19T15:50:00Z',
    nextBillingDate: '2026-09-05T15:50:00Z',
    amount: 14000,
    paymentMethod: 'CASH',
  },
];
