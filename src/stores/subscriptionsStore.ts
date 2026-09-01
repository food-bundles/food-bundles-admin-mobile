import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_SUBSCRIPTIONS, MOCK_PLANS, type RestaurantSubscription, type BillingCycle } from '@/mocks/subscriptions';

export interface CreateSubscriptionInput {
  restaurantId: string;
  restaurantName: string;
  planId: string;
  billingCycle: BillingCycle;
  startDate: string;
}

interface SubscriptionsState {
  subscriptions: RestaurantSubscription[];
  createSubscription: (input: CreateSubscriptionInput) => RestaurantSubscription;
  cancelSubscription: (id: string) => void;
}

function nextBillingDate(startDate: string, cycle: BillingCycle): string {
  const start = new Date(startDate);
  const next = new Date(start);
  if (cycle === 'WEEKLY') next.setDate(start.getDate() + 7);
  else next.setMonth(start.getMonth() + 1);
  return next.toISOString();
}

/** Session-only mutable subscription state seeded from MOCK_SUBSCRIPTIONS, so "Create subscription" and "Cancel" actually change what the list shows. */
export const useSubscriptionsStore = create<SubscriptionsState>((set) => ({
  subscriptions: MOCK_SUBSCRIPTIONS,
  createSubscription: (input) => {
    const plan = MOCK_PLANS.find((p) => p.id === input.planId);
    const amount = plan ? (input.billingCycle === 'WEEKLY' ? plan.weeklyPrice : plan.monthlyPrice) : 0;
    const subscription: RestaurantSubscription = {
      id: generateId('sub'),
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      planId: input.planId,
      status: 'ACTIVE',
      billingCycle: input.billingCycle,
      startDate: input.startDate,
      nextBillingDate: nextBillingDate(input.startDate, input.billingCycle),
      amount,
      paymentMethod: 'MOBILE_MONEY',
    };
    set((state) => ({ subscriptions: [subscription, ...state.subscriptions] }));
    return subscription;
  },
  cancelSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((s) => (s.id === id ? { ...s, status: 'CANCELLED' } : s)),
    })),
}));
