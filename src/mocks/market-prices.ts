/**
 * Trading-dashboard mock data barrel. Split across marketPriceSeed.ts (base
 * prices + commodity catalogue), marketPriceSeries.ts (30-day OHLC + volume
 * generation), and marketPriceAnalytics.ts (RSI/MA/momentum/comparison
 * derivations) to respect the 200-line file cap. Re-exported here under the
 * original `market-prices` module path so existing imports keep working.
 */
export type { CommodityId, CommodityInfo, MarketKey } from './marketPriceSeed';
export { COMMODITIES, HISTORY_DAYS } from './marketPriceSeed';
export type { MarketPriceDay, MarketPriceSeries } from './marketPriceSeries';
export { MOCK_MARKET_PRICE_SERIES, getSeries } from './marketPriceSeries';
export type { ComparisonPreset, MomentumReading, PriceMomentum } from './marketPriceAnalytics';
export {
  computeRsi14,
  computeMovingAverage7,
  rsiForCommodity,
  momentumForCommodity,
  comparisonSeries,
  latestMarketPriceDate,
} from './marketPriceAnalytics';
