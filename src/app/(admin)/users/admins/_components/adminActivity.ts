import { MOCK_ORDERS } from '@/mocks/orders';

export interface AdminActivityEntry {
  id: string;
  label: string;
  timestamp: string;
}

export interface AdminActivity {
  lastLoginAt: string;
  totalOrdersManaged: number;
  entries: AdminActivityEntry[];
}

/**
 * Deterministic mock activity for an admin's detail screen — derived from the admin's id (so the
 * same admin always shows the same numbers across renders/screens) rather than a random count on
 * every mount, and reuses real order ids from MOCK_ORDERS in the action-log labels so it reads as
 * plausible history instead of obviously fake placeholder text.
 */
export function buildAdminActivity(adminId: string): AdminActivity {
  const seed = adminId.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const totalOrdersManaged = 40 + (seed % 120);
  const sampleOrders = MOCK_ORDERS.slice(0, 3);
  const now = Date.now();

  return {
    lastLoginAt: new Date(now - (seed % 6) * 3_600_000).toISOString(),
    totalOrdersManaged,
    entries: [
      { id: 'act-1', label: `Updated status on order ${sampleOrders[0]?.id ?? 'FB-24810'}`, timestamp: new Date(now - 2 * 3_600_000).toISOString() },
      { id: 'act-2', label: `Approved a farmer submission`, timestamp: new Date(now - 26 * 3_600_000).toISOString() },
      { id: 'act-3', label: `Reviewed order ${sampleOrders[1]?.id ?? 'FB-24811'}`, timestamp: new Date(now - 50 * 3_600_000).toISOString() },
    ],
  };
}
