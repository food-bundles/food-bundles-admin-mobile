import { BASE_PRICE, BASE_VOLUME, HISTORY_DAYS, seededWobble, type CommodityId, type MarketKey } from './marketPriceSeed';

export interface MarketPriceDay {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Order count at FoodBundles for this commodity/day — only meaningful on the FoodBundles series. */
  volume: number;
}

export interface MarketPriceSeries {
  marketId: MarketKey;
  commodityId: CommodityId;
  days: MarketPriceDay[];
}

const TODAY = new Date(2026, 7, 29); // 2026-08-29, matches currentDate context.

function dayIso(offsetFromOldest: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - (HISTORY_DAYS - 1 - offsetFromOldest));
  return d.toISOString().slice(0, 10);
}

/** Builds a deterministic 30-day OHLC + volume series for one commodity at one market. */
function buildSeries(commodityId: CommodityId, marketId: MarketKey): MarketPriceSeries {
  const base = BASE_PRICE[commodityId][marketId];
  const isOwn = marketId === 'mkt-001';
  let prevClose = base;

  const days: MarketPriceDay[] = Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const trendUp = Math.sin(i / 6) * (base * 0.04);
    const wobble = seededWobble(i * 7 + marketId.length + commodityId.length) * (base * 0.02);
    const open = Math.round(prevClose);
    const close = Math.round(base + trendUp + wobble);
    const high = Math.round(Math.max(open, close) + Math.abs(seededWobble(i * 3 + 1)) * (base * 0.015) + 3);
    const low = Math.round(Math.min(open, close) - Math.abs(seededWobble(i * 5 + 2)) * (base * 0.015) - 3);
    prevClose = close;

    const volumeBase = BASE_VOLUME[commodityId];
    const volume = isOwn ? Math.round(volumeBase + seededWobble(i * 11) * (volumeBase * 0.3) + i * 0.4) : 0;

    return { date: dayIso(i), open, high, low, close, volume: Math.max(0, volume) };
  });

  return { marketId, commodityId, days };
}

const MARKET_KEYS: MarketKey[] = ['mkt-001', 'mkt-002', 'mkt-003', 'mkt-004', 'mkt-005'];
const COMMODITY_IDS: CommodityId[] = ['irishPotatoes', 'tomatoes', 'redOnions', 'cabbage', 'carrots'];

/** 5 commodities x 5 markets x 30 days of OHLC + volume. */
export const MOCK_MARKET_PRICE_SERIES: MarketPriceSeries[] = COMMODITY_IDS.flatMap((commodityId) =>
  MARKET_KEYS.map((marketId) => buildSeries(commodityId, marketId)),
);

export function getSeries(commodityId: CommodityId, marketId: MarketKey): MarketPriceSeries | undefined {
  return MOCK_MARKET_PRICE_SERIES.find((s) => s.commodityId === commodityId && s.marketId === marketId);
}
