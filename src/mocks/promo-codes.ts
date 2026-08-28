export type PromoType = 'PERCENT' | 'FIXED';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  restaurantIds: string[] | null;
}

/** 8 promo codes: mix of active/expired/exhausted. */
export const MOCK_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-001',
    code: 'WELCOME10',
    type: 'PERCENT',
    value: 10,
    minOrder: 20000,
    maxUses: 500,
    usedCount: 212,
    expiresAt: '2026-12-31T23:59:59Z',
    restaurantIds: null,
  },
  {
    id: 'promo-002',
    code: 'BISTRO5K',
    type: 'FIXED',
    value: 5000,
    minOrder: 30000,
    maxUses: 50,
    usedCount: 50,
    expiresAt: '2026-08-01T23:59:59Z',
    restaurantIds: ['rest-001'],
  },
  {
    id: 'promo-003',
    code: 'AUGUST15',
    type: 'PERCENT',
    value: 15,
    minOrder: 15000,
    maxUses: 300,
    usedCount: 98,
    expiresAt: '2026-08-31T23:59:59Z',
    restaurantIds: null,
  },
  {
    id: 'promo-004',
    code: 'PREMIUM20',
    type: 'PERCENT',
    value: 20,
    minOrder: 50000,
    maxUses: 100,
    usedCount: 34,
    expiresAt: '2026-10-15T23:59:59Z',
    restaurantIds: ['rest-001', 'rest-003', 'rest-010', 'rest-012'],
  },
  {
    id: 'promo-005',
    code: 'NEWYEAR2026',
    type: 'FIXED',
    value: 10000,
    minOrder: 40000,
    maxUses: 200,
    usedCount: 200,
    expiresAt: '2026-01-31T23:59:59Z',
    restaurantIds: null,
  },
  {
    id: 'promo-006',
    code: 'LAZA25',
    type: 'PERCENT',
    value: 25,
    minOrder: 25000,
    maxUses: 40,
    usedCount: 11,
    expiresAt: '2026-09-30T23:59:59Z',
    restaurantIds: ['rest-003'],
  },
  {
    id: 'promo-007',
    code: 'MIDYEAR',
    type: 'FIXED',
    value: 3000,
    minOrder: 10000,
    maxUses: 1000,
    usedCount: 640,
    expiresAt: '2026-07-01T23:59:59Z',
    restaurantIds: null,
  },
  {
    id: 'promo-008',
    code: 'MANOR30',
    type: 'PERCENT',
    value: 30,
    minOrder: 60000,
    maxUses: 25,
    usedCount: 4,
    expiresAt: '2026-11-01T23:59:59Z',
    restaurantIds: ['rest-010'],
  },
];
