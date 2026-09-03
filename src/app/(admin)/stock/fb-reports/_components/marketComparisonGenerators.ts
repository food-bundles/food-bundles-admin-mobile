import { formatRwf } from '@/lib/formatRwf';
import { COMMODITIES, MOCK_MARKET_PRICE_SERIES } from '@/mocks/market-prices';
import { MOCK_MARKETS } from '@/mocks/markets';

export interface CommodityComparisonRow {
  commodityName: string;
  pricesByMarket: { marketName: string; price: number }[];
}

export interface SavingsOpportunity {
  commodityName: string;
  fbPrice: number;
  lowestMarketName: string;
  lowestPrice: number;
  difference: number;
  differenceLabel: string;
}

/** Today's (most recent day in the mock series) price for all 5 commodities across all 5 markets. */
export function commodityComparisonToday(): CommodityComparisonRow[] {
  return COMMODITIES.map((commodity) => ({
    commodityName: commodity.name,
    pricesByMarket: MOCK_MARKETS.map((market) => {
      const series = MOCK_MARKET_PRICE_SERIES.find((s) => s.commodityId === commodity.id && s.marketId === market.id);
      return { marketName: market.name, price: series?.days.slice(-1)[0]?.close ?? 0 };
    }),
  }));
}

/** Flags every commodity where FoodBundles' price is higher than the cheapest competitor market. */
export function savingsOpportunities(): SavingsOpportunity[] {
  const opportunities: SavingsOpportunity[] = [];
  for (const commodity of COMMODITIES) {
    const fbSeries = MOCK_MARKET_PRICE_SERIES.find((s) => s.commodityId === commodity.id && s.marketId === 'mkt-001');
    const fbPrice = fbSeries?.days.slice(-1)[0]?.close ?? 0;
    let lowestPrice = Infinity;
    let lowestMarketName = '';
    for (const market of MOCK_MARKETS) {
      if (market.id === 'mkt-001') continue;
      const series = MOCK_MARKET_PRICE_SERIES.find((s) => s.commodityId === commodity.id && s.marketId === market.id);
      const price = series?.days.slice(-1)[0]?.close ?? Infinity;
      if (price < lowestPrice) {
        lowestPrice = price;
        lowestMarketName = market.name;
      }
    }
    if (fbPrice > lowestPrice) {
      const difference = fbPrice - lowestPrice;
      opportunities.push({
        commodityName: commodity.name,
        fbPrice,
        lowestMarketName,
        lowestPrice,
        difference,
        differenceLabel: formatRwf(difference),
      });
    }
  }
  return opportunities;
}
