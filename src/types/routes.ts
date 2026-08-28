/** Params for every dynamic (admin) route. Kept in sync with src/app/(admin)/. */
export type AdminRouteParams = {
  '/(admin)/orders/[id]': { id: string };
  '/(admin)/users/restaurants/[id]': { id: string };
  '/(admin)/users/farmers/[id]': { id: string };
  '/(admin)/users/affiliators/[id]': { id: string };
  '/(admin)/users/admins/[id]': { id: string };
  '/(admin)/stock/products/[id]': { id: string };
  '/(admin)/markets/[marketId]': { marketId: string };
  '/(admin)/markets/[marketId]/record-price': { marketId: string };
  '/(admin)/vouchers/[id]': { id: string };
  '/(admin)/deposits/[walletId]': { walletId: string };
  '/(admin)/subscriptions/plans/[id]': { id: string };
  '/(admin)/promo-codes/[id]': { id: string };
  '/(admin)/newsletter/campaigns/[id]': { id: string };
  '/(admin)/farmer-submissions/[id]': { id: string };
  '/(admin)/contact-submissions/[id]': { id: string };
};
