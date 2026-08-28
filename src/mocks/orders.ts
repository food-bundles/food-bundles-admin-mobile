import { orderItem, type OrderItem } from './orderItem';
import { ORDERS_RECENT } from './ordersRecent';

export type { OrderItem };
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER' | 'VOUCHER';

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusEvent[];
}

const ORDERS_EARLY: Order[] = [
  {
    id: 'FB-24810',
    restaurantId: 'rest-001',
    restaurantName: 'Kigali Bistro',
    items: [
      orderItem('prod-001', 'Irish Potatoes', 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=200', 2, 12500),
      orderItem('prod-002', 'Fresh Tomatoes', 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=200', 3, 8200),
    ],
    total: 49600,
    status: 'DELIVERED',
    paymentMethod: 'MOBILE_MONEY',
    deliveryAddress: 'KG 7 Ave, Kimihurura',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-01T09:00:00Z' },
      { status: 'CONFIRMED', timestamp: '2026-08-01T09:20:00Z' },
      { status: 'PREPARING', timestamp: '2026-08-01T10:00:00Z' },
      { status: 'READY', timestamp: '2026-08-01T12:00:00Z' },
      { status: 'IN_TRANSIT', timestamp: '2026-08-01T13:00:00Z' },
      { status: 'DELIVERED', timestamp: '2026-08-01T14:30:00Z' },
    ],
  },
  {
    id: 'FB-24811',
    restaurantId: 'rest-003',
    restaurantName: 'Laza',
    items: [
      orderItem('prod-015', 'Avocados', 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=200', 1, 8900),
      orderItem('prod-018', 'Mangoes', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200', 2, 9800),
    ],
    total: 28500,
    status: 'IN_TRANSIT',
    paymentMethod: 'CARD',
    deliveryAddress: 'KG 11 Ave, Kacyiru',
    createdAt: '2026-08-10T08:15:00Z',
    updatedAt: '2026-08-10T11:45:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-10T08:15:00Z' },
      { status: 'CONFIRMED', timestamp: '2026-08-10T08:40:00Z' },
      { status: 'PREPARING', timestamp: '2026-08-10T09:30:00Z' },
      { status: 'READY', timestamp: '2026-08-10T10:50:00Z' },
      { status: 'IN_TRANSIT', timestamp: '2026-08-10T11:45:00Z' },
    ],
  },
  {
    id: 'FB-24812',
    restaurantId: 'rest-004',
    restaurantName: 'Heaven Restaurant',
    items: [orderItem('prod-023', 'Rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200', 3, 32000)],
    total: 96000,
    status: 'READY',
    paymentMethod: 'BANK_TRANSFER',
    deliveryAddress: 'KG 9 Ave, Kiyovu',
    createdAt: '2026-08-15T07:00:00Z',
    updatedAt: '2026-08-15T09:10:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-15T07:00:00Z' },
      { status: 'CONFIRMED', timestamp: '2026-08-15T07:15:00Z' },
      { status: 'PREPARING', timestamp: '2026-08-15T08:00:00Z' },
      { status: 'READY', timestamp: '2026-08-15T09:10:00Z' },
    ],
  },
  {
    id: 'FB-24813',
    restaurantId: 'rest-008',
    restaurantName: 'Poivre Noir',
    items: [orderItem('prod-024', 'Cooking Oil', 'https://images.unsplash.com/photo-1652282556241-0ce13285d00f?w=200', 1, 41000)],
    total: 41000,
    status: 'PREPARING',
    paymentMethod: 'VOUCHER',
    deliveryAddress: 'KG 3 Ave, Kiyovu',
    createdAt: '2026-08-18T10:30:00Z',
    updatedAt: '2026-08-18T11:00:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-18T10:30:00Z' },
      { status: 'CONFIRMED', timestamp: '2026-08-18T10:45:00Z' },
      { status: 'PREPARING', timestamp: '2026-08-18T11:00:00Z' },
    ],
  },
  {
    id: 'FB-24814',
    restaurantId: 'rest-010',
    restaurantName: 'The Manor',
    items: [
      orderItem('prod-020', 'Eggs', 'https://images.unsplash.com/photo-1639194335563-d56b83f0060c?w=200', 4, 9800),
      orderItem('prod-021', 'Fresh Milk', 'https://images.unsplash.com/photo-1517448931760-9bf4414148c5?w=200', 2, 6500),
    ],
    total: 52200,
    status: 'CONFIRMED',
    paymentMethod: 'CASH',
    deliveryAddress: 'KG 17 Ave, Kimihurura',
    createdAt: '2026-08-20T06:50:00Z',
    updatedAt: '2026-08-20T07:10:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-08-20T06:50:00Z' },
      { status: 'CONFIRMED', timestamp: '2026-08-20T07:10:00Z' },
    ],
  },
  {
    id: 'FB-24815',
    restaurantId: 'rest-012',
    restaurantName: 'Kigali Marriott Kitchen',
    items: [orderItem('prod-022', 'Chicken (whole)', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200', 2, 54000)],
    total: 108000,
    status: 'PENDING',
    paymentMethod: 'MOBILE_MONEY',
    deliveryAddress: 'KN 3 Ave, Nyarugenge',
    createdAt: '2026-08-24T05:30:00Z',
    updatedAt: '2026-08-24T05:30:00Z',
    statusHistory: [{ status: 'PENDING', timestamp: '2026-08-24T05:30:00Z' }],
  },
  {
    id: 'FB-24816',
    restaurantId: 'rest-002',
    restaurantName: 'Imboni',
    items: [orderItem('prod-004', 'Cabbage', 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=200', 5, 3800)],
    total: 19000,
    status: 'CANCELLED',
    paymentMethod: 'CASH',
    deliveryAddress: 'KN 4 Rd, Nyarugenge',
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-07-28T09:30:00Z',
    statusHistory: [
      { status: 'PENDING', timestamp: '2026-07-28T09:00:00Z' },
      { status: 'CANCELLED', timestamp: '2026-07-28T09:30:00Z', note: 'Restaurant cancelled — duplicate order.' },
    ],
  },
];

/**
 * 12 orders (FB-24810 through FB-24821) across all 8 statuses, spread over
 * the last 30 days. Split into two source files to stay under the 200-line
 * cap — earlier orders here, later ones in ordersRecent.ts.
 */
export const MOCK_ORDERS: Order[] = [...ORDERS_EARLY, ...ORDERS_RECENT];
