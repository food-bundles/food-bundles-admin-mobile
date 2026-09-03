import { create } from 'zustand';
import { MOCK_ORDERS, type Order, type OrderItem, type PaymentMethod } from '@/mocks/orders';

export interface CreateOrderInput {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

interface OrdersState {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  paymentRequestSent: Record<string, boolean>;
  requestPayment: (orderId: string) => void;
}

function nextOrderId(existing: Order[]): string {
  const numeric = existing
    .map((o) => Number(o.id.replace('FB-', '')))
    .filter((n) => Number.isFinite(n));
  const max = numeric.length > 0 ? Math.max(...numeric) : 24800;
  return `FB-${max + 1}`;
}

/**
 * Session-only, mutable order state seeded from the static MOCK_ORDERS array — needed because
 * Section 8 (create/reorder on behalf of a restaurant) must actually add new orders that then
 * show up in the Orders list and are navigable by id, which a read-only mock array cannot do.
 */
export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: MOCK_ORDERS,
  paymentRequestSent: {},
  createOrder: (input) => {
    const total = input.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const now = new Date().toISOString();
    const order: Order = {
      id: nextOrderId(get().orders),
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      items: input.items,
      total,
      status: 'PENDING',
      paymentMethod: input.paymentMethod,
      deliveryAddress: input.deliveryAddress,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: 'PENDING', timestamp: now, note: 'Created on behalf of restaurant by admin.' }],
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },
  requestPayment: (orderId) => set((state) => ({ paymentRequestSent: { ...state.paymentRequestSent, [orderId]: true } })),
}));
