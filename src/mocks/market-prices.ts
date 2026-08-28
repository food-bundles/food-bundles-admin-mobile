export interface MarketPriceDay {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketPriceSeries {
  marketId: string;
  productId: string;
  days: MarketPriceDay[];
  rsi14: number;
}

function buildSeries(marketId: string, productId: string, base: number, isOwn: boolean): MarketPriceSeries {
  const days: MarketPriceDay[] = Array.from({ length: 7 }, (_, i) => {
    const drift = isOwn ? -1 : 1;
    const wobble = (i % 3 === 0 ? 1 : -1) * 60 * drift;
    const open = base + wobble;
    const close = open + (isOwn ? -80 : 40);
    const high = Math.max(open, close) + 90;
    const low = Math.min(open, close) - 60;
    const date = new Date(2026, 7, 20 + i).toISOString().slice(0, 10);
    return { date, open, high, low, close, volume: 40 + i * 6 + (isOwn ? 20 : 0) };
  });
  return { marketId, productId, days, rsi14: isOwn ? 62 : 48 };
}

/**
 * 7-day OHLC price history per product per market, keyed for the
 * candlestick chart and price-comparison screen. FoodBundles prices trend
 * lower than competitor markets for the key products, per the discovery
 * decision that FoodBundles should show as the "best" price.
 */
export const MOCK_MARKET_PRICES: MarketPriceSeries[] = [
  buildSeries('mkt-001', 'prod-001', 1250, true),
  buildSeries('mkt-002', 'prod-001', 1320, false),
  buildSeries('mkt-003', 'prod-001', 1290, false),
  buildSeries('mkt-001', 'prod-002', 1640, true),
  buildSeries('mkt-002', 'prod-002', 1710, false),
  buildSeries('mkt-004', 'prod-002', 1680, false),
  buildSeries('mkt-001', 'prod-003', 960, true),
  buildSeries('mkt-002', 'prod-003', 1020, false),
  buildSeries('mkt-005', 'prod-003', 995, false),
  buildSeries('mkt-001', 'prod-014', 740, true),
  buildSeries('mkt-003', 'prod-014', 810, false),
  buildSeries('mkt-004', 'prod-014', 790, false),
];
