import { MOCK_ORDERS } from '@/mocks/orders';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import { MOCK_LOAN_APPLICATIONS } from '@/mocks/loanApplications';
import { MOCK_FARMER_SUBMISSIONS } from '@/mocks/farmer-submissions';
import { MOCK_CONTACT_SUBMISSIONS } from '@/mocks/contact-submissions';

function isSameDay(iso: string, reference: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}

export interface DashboardMetrics {
  ordersToday: number;
  ordersYesterday: number;
  revenueToday: number;
  revenueYesterday: number;
  activeRestaurants: number;
  activeRestaurantsLastWeek: number;
  pendingVouchers: number;
  pendingSubmissions: number;
  unreadContacts: number;
}

/** Derives the dashboard's headline metrics from the mock data, relative to `now`. */
export function computeDashboardMetrics(now: Date = new Date()): DashboardMetrics {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const todayOrders = MOCK_ORDERS.filter((o) => isSameDay(o.createdAt, now));
  const yesterdayOrders = MOCK_ORDERS.filter((o) => isSameDay(o.createdAt, yesterday));
  const activeRestaurants = MOCK_RESTAURANTS.filter((r) => r.status === 'ACTIVE').length;

  return {
    ordersToday: todayOrders.length,
    ordersYesterday: yesterdayOrders.length,
    revenueToday: todayOrders.reduce((sum, o) => sum + o.total, 0),
    revenueYesterday: yesterdayOrders.reduce((sum, o) => sum + o.total, 0),
    activeRestaurants,
    // No historical snapshot exists in mock data; one fewer active restaurant a week ago is a
    // plausible fixed baseline for the delta indicator, not a computed trend.
    activeRestaurantsLastWeek: Math.max(0, activeRestaurants - 1),
    pendingVouchers: MOCK_LOAN_APPLICATIONS.filter((l) => l.status === 'PENDING').length,
    pendingSubmissions: MOCK_FARMER_SUBMISSIONS.filter((f) => f.reviewedAt === null).length,
    unreadContacts: MOCK_CONTACT_SUBMISSIONS.filter((c) => c.status === 'UNREAD').length,
  };
}
