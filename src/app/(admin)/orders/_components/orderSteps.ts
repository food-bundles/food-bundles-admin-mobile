import type { TranslationKey } from '@/i18n';
import type { OrderStatus } from '@/mocks/orders';

/** The 6-step happy path. CANCELLED/REFUNDED are terminal and don't appear on the track. */
export const ORDER_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'IN_TRANSIT', 'DELIVERED'];

export const STATUS_KEY: Record<OrderStatus, TranslationKey> = {
  PENDING: 'status.pending',
  CONFIRMED: 'status.confirmed',
  PREPARING: 'status.preparing',
  READY: 'status.ready',
  IN_TRANSIT: 'status.inTransit',
  DELIVERED: 'status.delivered',
  CANCELLED: 'status.cancelled',
  REFUNDED: 'status.refunded',
};

export function stepIndex(status: OrderStatus): number {
  return ORDER_STEPS.indexOf(status);
}

export function isTerminalNonHappy(status: OrderStatus): boolean {
  return status === 'CANCELLED' || status === 'REFUNDED';
}
