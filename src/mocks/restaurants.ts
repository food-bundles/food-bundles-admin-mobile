import { RESTAURANTS_MORE } from './restaurantsMore';

export type RestaurantStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type SubscriptionTier = 'BASIC' | 'PREMIUM' | null;

export interface Restaurant {
  id: string;
  name: string;
  tin: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  imageUri: string;
  subscription: SubscriptionTier;
  walletBalance: number;
  createdAt: string;
  status: RestaurantStatus;
  affiliatorsCount: number;
}

const RESTAURANTS_FIRST: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'Kigali Bistro',
    tin: '104829371',
    email: 'orders@kigalibistro.rw',
    phone: '+250788112233',
    address: 'KG 7 Ave, Kimihurura',
    district: 'Gasabo',
    imageUri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    subscription: 'PREMIUM',
    walletBalance: 285000,
    createdAt: '2025-01-15T08:00:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 2,
  },
  {
    id: 'rest-002',
    name: 'Imboni',
    tin: '104773621',
    email: 'admin@imboni.rw',
    phone: '+250788223344',
    address: 'KN 4 Rd, Nyarugenge',
    district: 'Nyarugenge',
    imageUri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    subscription: 'BASIC',
    walletBalance: 62000,
    createdAt: '2025-01-22T09:30:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 1,
  },
  {
    id: 'rest-003',
    name: 'Laza',
    tin: '104991284',
    email: 'contact@laza.rw',
    phone: '+250788334455',
    address: 'KG 11 Ave, Kacyiru',
    district: 'Gasabo',
    imageUri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    subscription: 'PREMIUM',
    walletBalance: 410000,
    createdAt: '2025-02-03T07:45:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 3,
  },
  {
    id: 'rest-004',
    name: 'Heaven Restaurant',
    tin: '104556712',
    email: 'info@heaven.rw',
    phone: '+250788445566',
    address: 'KG 9 Ave, Kiyovu',
    district: 'Nyarugenge',
    imageUri: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400',
    subscription: 'PREMIUM',
    walletBalance: 198500,
    createdAt: '2025-02-10T10:15:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 2,
  },
  {
    id: 'rest-005',
    name: 'Repub Lounge',
    tin: '104332198',
    email: 'orders@republounge.rw',
    phone: '+250788556677',
    address: 'KG 5 Ave, Kimihurura',
    district: 'Gasabo',
    imageUri: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
    subscription: 'BASIC',
    walletBalance: 34000,
    createdAt: '2025-02-18T12:00:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 0,
  },
  {
    id: 'rest-006',
    name: 'Meze Fresh',
    tin: '104112837',
    email: 'hello@mezefresh.rw',
    phone: '+250788667788',
    address: 'KN 78 St, Remera',
    district: 'Gasabo',
    imageUri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    subscription: null,
    walletBalance: 0,
    createdAt: '2025-03-01T14:20:00Z',
    status: 'PENDING_VERIFICATION',
    affiliatorsCount: 0,
  },
  {
    id: 'rest-007',
    name: 'Sole e Luna',
    tin: '104887623',
    email: 'admin@soleeluna.rw',
    phone: '+250788778899',
    address: 'KG 15 Ave, Kacyiru',
    district: 'Gasabo',
    imageUri: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400',
    subscription: 'BASIC',
    walletBalance: 51500,
    createdAt: '2025-03-05T09:00:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 1,
  },
  {
    id: 'rest-008',
    name: 'Poivre Noir',
    tin: '104229475',
    email: 'contact@poivrenoir.rw',
    phone: '+250788889900',
    address: 'KG 3 Ave, Kiyovu',
    district: 'Nyarugenge',
    imageUri: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
    subscription: 'PREMIUM',
    walletBalance: 152000,
    createdAt: '2025-03-11T11:30:00Z',
    status: 'ACTIVE',
    affiliatorsCount: 2,
  },
  {
    id: 'rest-009',
    name: 'Zen Garden',
    tin: '104665521',
    email: 'orders@zengarden.rw',
    phone: '+250788990011',
    address: 'KG 21 Ave, Nyamirambo',
    district: 'Nyarugenge',
    imageUri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    subscription: 'BASIC',
    walletBalance: 28000,
    createdAt: '2025-03-19T08:45:00Z',
    status: 'SUSPENDED',
    affiliatorsCount: 1,
  },
];

/**
 * 15 restaurants across Kigali districts, mix of subscription tiers and
 * statuses. Split into two source files to stay under the 200-line cap —
 * rest-001 through rest-009 here, rest-010 through rest-015 in
 * restaurantsMore.ts.
 */
export const MOCK_RESTAURANTS: Restaurant[] = [...RESTAURANTS_FIRST, ...RESTAURANTS_MORE];
