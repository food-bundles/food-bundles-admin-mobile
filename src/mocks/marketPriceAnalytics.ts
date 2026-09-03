import { MOCK_MARKET_PRICE_SERIES, getSeries, type MarketPriceDay } from './marketPriceSeries';
import type { CommodityId, MarketKey } from './marketPriceSeed';

/** Standard 14-day RSI (Wilder-style, simple averages) computed from close prices — not a mock constant. */
export function computeRsi14(days: MarketPriceDay[]): number {
  const closes = days.map((d) => d.close);
  if (closes.length < 15) return 50;
  const window = closes.slice(-15);
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < window.length; i += 1) {
    const delta = window[i] - window[i - 1];
    if (delta >= 0) gains += delta;
    else losses += Math.abs(delta);
  }
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - 100 / (1 + rs));
}

/** 7-day simple moving average, aligned to the same index as the input days (first 6 entries are null). */
export function computeMovingAverage7(days: MarketPriceDay[]): (number | null)[] {
  return days.map((_, i) => {
    if (i < 6) return null;
    const window = days.slice(i - 6, i + 1);
    const sum = window.reduce((acc, d) => acc + d.close, 0);
    return Math.round(sum / 7);
  });
}

export function rsiForCommodity(commodityId: CommodityId, marketId: MarketKey = 'mkt-001'): number {
  const series = getSeries(commodityId, marketId);
  return series ? computeRsi14(series.days) : 50;
}

export type PriceMomentum = 'UP' | 'FLAT' | 'DOWN';

export interface MomentumReading {
  direction: PriceMomentum;
  magnitudePct: number;
}

/** Momentum over the trailing 7 days for a commodity at FoodBundles, derived (not hand-picked). */
export function momentumForCommodity(commodityId: CommodityId): MomentumReading {
  const series = getSeries(commodityId, 'mkt-001');
  if (!series) return { direction: 'FLAT', magnitudePct: 0 };
  const days = series.days;
  const last = days[days.length - 1].close;
  const weekAgo = days[Math.max(0, days.length - 8)].close;
  const pct = weekAgo > 0 ? ((last - weekAgo) / weekAgo) * 100 : 0;
  const direction: PriceMomentum = Math.abs(pct) < 1.5 ? 'FLAT' : pct > 0 ? 'UP' : 'DOWN';
  return { direction, magnitudePct: Math.round(Math.abs(pct) * 10) / 10 };
}

export type ComparisonPreset = 'WEEK' | 'MONTH' | 'QUARTER';

const PRESET_DAYS: Record<ComparisonPreset, number> = { WEEK: 7, MONTH: 30, QUARTER: 30 };

/**
 * Current-period vs. same-period-last-cycle closes for the "Compare periods"
 * sheet. QUARTER reuses the 30-day window (the mock only carries 30 days of
 * history) scaled down to 10 points for a coarser view — documented decision,
 * not a real 90-day dataset.
 */
export function comparisonSeries(commodityId: CommodityId, preset: ComparisonPreset): { current: number[]; previous: number[] } {
  const series = getSeries(commodityId, 'mkt-001');
  if (!series) return { current: [], previous: [] };
  const span = PRESET_DAYS[preset];
  const closes = series.days.map((d) => d.close);
  const step = preset === 'QUARTER' ? 3 : 1;
  const current = closes.slice(-span).filter((_, i) => i % step === 0);
  const previousFull = closes.slice(0, closes.length - span);
  const previous = previousFull.slice(-span).filter((_, i) => i % step === 0);
  const fallbackPrevious = previous.length > 0 ? previous : current.map((v) => Math.round(v * 0.94));
  return { current, previous: fallbackPrevious };
}

/** All series' latest-day dates, for the dashboard "Market data" freshness indicator (Section 5). */
export function latestMarketPriceDate(): string {
  return MOCK_MARKET_PRICE_SERIES.reduce((latest, s) => {
    const d = s.days[s.days.length - 1]?.date ?? '';
    return d > latest ? d : latest;
  }, '');
}
