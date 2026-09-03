import { allEffectiveProducts } from '@/stores/productsStore';
import { ordersInRange } from './reportGenerators';

export interface LowStockRow {
  id: string;
  name: string;
  stock: number;
  reorderThreshold: number;
}

export interface TurnoverRow {
  id: string;
  name: string;
  avgDailySales: number;
  daysOfStock: number;
}

/** Stock-in (mocked as a fixed replenishment curve) vs. stock-out (units sold, from real order items) by day. */
export function stockMovementByDay(from: Date, to: Date): { x: number; stockIn: number; stockOut: number }[] {
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000));
  const orders = ordersInRange(from, to);
  const outBuckets = new Array(days + 1).fill(0);
  for (const order of orders) {
    const dayIndex = Math.round((new Date(order.createdAt).getTime() - from.getTime()) / 86_400_000);
    if (dayIndex < 0 || dayIndex >= outBuckets.length) continue;
    for (const item of order.items) outBuckets[dayIndex] += item.qty;
  }
  // Stock-in is mocked as a steady restock rhythm — no real "goods received" event log exists in
  // this codebase's mock data, so a plausible restock curve (restock every 3rd day) stands in.
  return outBuckets.map((stockOut, x) => ({ x, stockOut, stockIn: x % 3 === 0 ? stockOut + 15 : 0 }));
}

export function productsBelowThreshold(): LowStockRow[] {
  return allEffectiveProducts()
    .filter((p) => p.stock < p.reorderThreshold)
    .map((p) => ({ id: p.id, name: p.name, stock: p.stock, reorderThreshold: p.reorderThreshold }));
}

export function turnoverRates(from: Date, to: Date): TurnoverRow[] {
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000));
  const orders = ordersInRange(from, to);
  const soldByProduct = new Map<string, { id: string; name: string; qty: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = soldByProduct.get(item.productId);
      if (existing) existing.qty += item.qty;
      else soldByProduct.set(item.productId, { id: item.productId, name: item.name, qty: item.qty });
    }
  }
  const products = allEffectiveProducts();
  return [...soldByProduct.values()].map((entry) => {
    const avgDailySales = entry.qty / days;
    const product = products.find((p) => p.id === entry.id);
    const daysOfStock = avgDailySales > 0 ? Math.round((product?.stock ?? 0) / avgDailySales) : 0;
    return { id: entry.id, name: entry.name, avgDailySales: Math.round(avgDailySales * 10) / 10, daysOfStock };
  });
}
