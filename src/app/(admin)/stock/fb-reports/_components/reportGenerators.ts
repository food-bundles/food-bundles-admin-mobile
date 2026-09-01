import { formatRwf } from '@/lib/formatRwf';
import { MOCK_ORDERS, type Order, type PaymentMethod } from '@/mocks/orders';
import { MOCK_PRODUCTS } from '@/mocks/products';

export type ReportType = 'SALES_SUMMARY' | 'STOCK_MOVEMENT' | 'MARKET_COMPARISON';

export interface ReportSummary {
  totalOrders: number;
  totalRevenue: string;
  avgOrderValue: string;
  csv: string;
}

export interface TopProductRow {
  name: string;
  revenue: number;
}

export interface TopRestaurantRow {
  name: string;
  total: number;
  sparkline: { x: number; y: number }[];
}

export interface PaymentBreakdownRow {
  method: PaymentMethod;
  count: number;
  pct: number;
}

export function ordersInRange(from: Date, to: Date): Order[] {
  return MOCK_ORDERS.filter((o) => {
    const created = new Date(o.createdAt);
    return created >= from && created <= to;
  });
}

/** Generates the KPI summary + CSV string for the selected report type and date range. Fully mocked, no fetch. */
export function generateReport(type: ReportType, from: Date, to: Date): ReportSummary {
  const orders = ordersInRange(from, to);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avg = orders.length > 0 ? totalRevenue / orders.length : 0;

  const rows = orders.map((o) => `${o.id},${o.restaurantName},${o.status},${o.total}`);
  const header = 'orderId,restaurant,status,total';
  const csv = [header, ...rows].join('\n');

  return {
    totalOrders: orders.length,
    totalRevenue: formatRwf(totalRevenue),
    avgOrderValue: formatRwf(avg),
    csv: `report_type:${type}\n${csv}`,
  };
}

export function topProductByRevenue(orders: Order[]): string {
  const byProduct = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      byProduct.set(item.name, (byProduct.get(item.name) ?? 0) + item.totalPrice);
    }
  }
  let best = '';
  let bestRevenue = -1;
  for (const [name, revenue] of byProduct) {
    if (revenue > bestRevenue) {
      best = name;
      bestRevenue = revenue;
    }
  }
  return best || MOCK_PRODUCTS[0]?.name || '';
}

export function top5ProductsByRevenue(orders: Order[]): TopProductRow[] {
  const byProduct = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      byProduct.set(item.name, (byProduct.get(item.name) ?? 0) + item.totalPrice);
    }
  }
  return [...byProduct.entries()]
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export function top5RestaurantsByValue(orders: Order[]): TopRestaurantRow[] {
  const byRestaurant = new Map<string, number[]>();
  for (const order of orders) {
    const list = byRestaurant.get(order.restaurantName) ?? [];
    list.push(order.total);
    byRestaurant.set(order.restaurantName, list);
  }
  return [...byRestaurant.entries()]
    .map(([name, totals]) => ({
      name,
      total: totals.reduce((sum, t) => sum + t, 0),
      sparkline: totals.slice(-7).map((y, x) => ({ x, y })),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export function paymentMethodBreakdown(orders: Order[]): PaymentBreakdownRow[] {
  const byMethod = new Map<PaymentMethod, number>();
  for (const order of orders) {
    byMethod.set(order.paymentMethod, (byMethod.get(order.paymentMethod) ?? 0) + 1);
  }
  const total = orders.length || 1;
  return [...byMethod.entries()]
    .map(([method, count]) => ({ method, count, pct: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
}

/** Revenue by day within the range, for the AreaChart's x-axis. */
export function revenueByDay(orders: Order[], from: Date, to: Date): { x: number; y: number }[] {
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000));
  const buckets = new Array(days + 1).fill(0);
  for (const order of orders) {
    const dayIndex = Math.round((new Date(order.createdAt).getTime() - from.getTime()) / 86_400_000);
    if (dayIndex >= 0 && dayIndex < buckets.length) buckets[dayIndex] += order.total;
  }
  return buckets.map((y, x) => ({ x, y }));
}
