export type AffiliatorRole = 'MANAGER' | 'STAFF' | 'OWNER';
export type AffiliatorStatus = 'ACTIVE' | 'SUSPENDED';

export interface Affiliator {
  id: string;
  name: string;
  email: string;
  phone: string;
  restaurantId: string;
  restaurantName: string;
  role: AffiliatorRole;
  status: AffiliatorStatus;
  createdAt: string;
  imageUri: string;
}

/** 8 affiliators, cross-referencing restaurants.ts by id/name. */
export const MOCK_AFFILIATORS: Affiliator[] = [
  {
    id: 'aff-001',
    name: 'Claudine Iradukunda',
    email: 'claudine@kigalibistro.rw',
    phone: '+250788101010',
    restaurantId: 'rest-001',
    restaurantName: 'Kigali Bistro',
    role: 'OWNER',
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:10:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'aff-002',
    name: 'Olivier Kagame',
    email: 'olivier@kigalibistro.rw',
    phone: '+250788101011',
    restaurantId: 'rest-001',
    restaurantName: 'Kigali Bistro',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-01-16T09:00:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 'aff-003',
    name: 'Sandrine Uwera',
    email: 'sandrine@imboni.rw',
    phone: '+250788202020',
    restaurantId: 'rest-002',
    restaurantName: 'Imboni',
    role: 'OWNER',
    status: 'ACTIVE',
    createdAt: '2025-01-22T09:35:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 'aff-004',
    name: 'Fabrice Nkusi',
    email: 'fabrice@laza.rw',
    phone: '+250788303030',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    role: 'OWNER',
    status: 'ACTIVE',
    createdAt: '2025-02-03T07:50:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 'aff-005',
    name: 'Beatrice Mukandayisenga',
    email: 'beatrice@laza.rw',
    phone: '+250788303031',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    role: 'STAFF',
    status: 'ACTIVE',
    createdAt: '2025-02-05T10:00:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 'aff-006',
    name: 'Yves Rugamba',
    email: 'yves@heaven.rw',
    phone: '+250788404040',
    restaurantId: 'rest-004',
    restaurantName: 'Heaven Restaurant',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2025-02-10T10:20:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=23',
  },
  {
    id: 'aff-007',
    name: 'Christine Ahishakiye',
    email: 'christine@themanor.rw',
    phone: '+250789505050',
    restaurantId: 'rest-010',
    restaurantName: 'The Manor',
    role: 'MANAGER',
    status: 'SUSPENDED',
    createdAt: '2025-04-02T13:20:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=26',
  },
  {
    id: 'aff-008',
    name: 'Robert Mugabo',
    email: 'robert@marriottkgl.rw',
    phone: '+250789606060',
    restaurantId: 'rest-012',
    restaurantName: 'Kigali Marriott Kitchen',
    role: 'STAFF',
    status: 'ACTIVE',
    createdAt: '2025-04-22T10:10:00Z',
    imageUri: 'https://i.pravatar.cc/150?img=33',
  },
];
