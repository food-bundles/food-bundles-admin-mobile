/**
 * Seed data for the 30-day market-price history: base RWF/kg per commodity
 * per market, and the daily drift pattern used to derive OHLC. Matches the
 * restaurant app's 5 commodities (irishPotatoes/tomatoes/redOnions/cabbage/
 * carrots) and adds the 5-market comparison the admin trading dashboard
 * needs that the restaurant app (FoodBundles-only) does not.
 */
export type CommodityId = 'irishPotatoes' | 'tomatoes' | 'redOnions' | 'cabbage' | 'carrots';

export interface CommodityInfo {
  id: CommodityId;
  productId: string;
  name: string;
  unit: string;
}

/** Product ids match src/mocks/products.ts exactly (prod-001..005). */
export const COMMODITIES: CommodityInfo[] = [
  { id: 'irishPotatoes', productId: 'prod-001', name: 'Irish Potatoes', unit: 'kg' },
  { id: 'tomatoes', productId: 'prod-002', name: 'Tomatoes', unit: 'kg' },
  { id: 'redOnions', productId: 'prod-003', name: 'Red Onions', unit: 'kg' },
  { id: 'cabbage', productId: 'prod-004', name: 'Cabbage', unit: 'kg' },
  { id: 'carrots', productId: 'prod-005', name: 'Carrots', unit: 'kg' },
];

export type MarketKey = 'mkt-001' | 'mkt-002' | 'mkt-003' | 'mkt-004' | 'mkt-005';

/** Base RWF/kg per commodity at each market. FoodBundles (mkt-001) is always lowest, per discovery decision. */
export const BASE_PRICE: Record<CommodityId, Record<MarketKey, number>> = {
  irishPotatoes: { 'mkt-001': 360, 'mkt-002': 392, 'mkt-003': 378, 'mkt-004': 340, 'mkt-005': 385 },
  tomatoes: { 'mkt-001': 780, 'mkt-002': 845, 'mkt-003': 820, 'mkt-004': 760, 'mkt-005': 830 },
  redOnions: { 'mkt-001': 520, 'mkt-002': 565, 'mkt-003': 548, 'mkt-004': 505, 'mkt-005': 552 },
  cabbage: { 'mkt-001': 310, 'mkt-002': 338, 'mkt-003': 326, 'mkt-004': 298, 'mkt-005': 330 },
  carrots: { 'mkt-001': 400, 'mkt-002': 432, 'mkt-003': 418, 'mkt-004': 388, 'mkt-005': 424 },
};

/**
 * Deterministic pseudo-random wobble in [-1, 1], seeded from a numeric key so
 * the 30-day series is stable across renders without a real RNG dependency.
 */
export function seededWobble(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

export const HISTORY_DAYS = 30;

/** Daily order-count volume at FoodBundles, per commodity — used for the volume bars and RSI. */
export const BASE_VOLUME: Record<CommodityId, number> = {
  irishPotatoes: 48,
  tomatoes: 34,
  redOnions: 26,
  cabbage: 20,
  carrots: 22,
};
