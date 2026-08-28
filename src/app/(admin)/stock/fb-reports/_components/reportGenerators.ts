import { formatRwf } from '@/lib/formatRwf';
import { MOCK_ORDERS } from '@/mocks/orders';

export type ReportType = 'SALES_SUMMARY' | 'STOCK_MOVEMENT' | 'MARKET_COMPARISON';

export interface ReportSummary {
  totalOrders: number;
  totalRevenue: string;
  avgOrderValue: string;
  csv: string;
}

function ordersInRange(from: Date, to: Date) {
  return MOCK_ORDERS.filter((o) => {
    const created = new Date(o.createdAt);
    return created >= from && created <= to;
  });
}

/** Generates a summary + CSV string for the selected report type and date range. Fully mocked, no fetch. */
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
