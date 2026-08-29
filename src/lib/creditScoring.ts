export type CreditTier = 'A' | 'B' | 'C' | 'D';

export type DataConsentSource = 'rra' | 'eucl' | 'vubaVuba' | 'kayko' | 'foodbundles' | 'creditBureau';

/**
 * Weighted composite credit-scoring model (mirrors the restaurant app's v6/v7
 * consent-driven scoring): RRA 35%, cash flow 20%, compliance 15%,
 * location/vintage 10%, external credit 10%, repayment history 10%.
 * `cashFlow`/`compliance`/`vintage`/`repaymentHistory` are FoodBundles' own
 * transaction-history-derived categories (always available, no consent
 * needed); `rra` and `creditBureau` require restaurant consent to include.
 */
export const SOURCE_WEIGHT: Record<DataConsentSource, number> = {
  rra: 0.35,
  vubaVuba: 0.2, // cash flow
  kayko: 0.15, // compliance
  eucl: 0.1, // location / vintage
  creditBureau: 0.1, // external credit
  foodbundles: 0.1, // repayment history
};

/** The 5 third-party-plus-FoodBundles sources shown on the consent screen; FoodBundles is always granted. */
export const TOGGLEABLE_SOURCES: Exclude<DataConsentSource, 'foodbundles'>[] = ['rra', 'eucl', 'vubaVuba', 'kayko', 'creditBureau'];

export const ALL_CONSENT_SOURCES: DataConsentSource[] = ['rra', 'eucl', 'vubaVuba', 'kayko', 'foodbundles', 'creditBureau'];

/** Tier multiplier applied to verified average monthly sales to compute the base credit ceiling. */
export const TIER_MULTIPLIER: Record<CreditTier, number> = { A: 0.3, B: 0.2, C: 0.1, D: 0 };

/** Minimum verified average monthly sales (RWF) required to qualify for each tier. */
export const TIER_FLOOR_RWF: Record<CreditTier, number> = { A: 180_000, B: 120_000, C: 60_000, D: 0 };

/** Maps verified average monthly sales to a qualification tier. */
export function salesTier(verifiedAvgMonthlySales: number): CreditTier {
  if (verifiedAvgMonthlySales >= TIER_FLOOR_RWF.A) return 'A';
  if (verifiedAvgMonthlySales >= TIER_FLOOR_RWF.B) return 'B';
  if (verifiedAvgMonthlySales >= TIER_FLOOR_RWF.C) return 'C';
  return 'D';
}

/**
 * creditLimit = TIER_MULTIPLIER × verifiedAvgMonthlySales − currentExposure.
 * Floors at 0 — a restaurant already at or beyond its ceiling has no further limit.
 */
export function computeCreditLimit(verifiedAvgMonthlySales: number, currentExposure: number): number {
  const tier = salesTier(verifiedAvgMonthlySales);
  const ceiling = TIER_MULTIPLIER[tier] * verifiedAvgMonthlySales;
  return Math.max(0, Math.round(ceiling - currentExposure));
}

export interface ScoreContribution {
  source: DataConsentSource;
  weight: number;
  contribution: number;
}

export interface ComputedScore {
  scoreOutOf300: number;
  tier: CreditTier;
  breakdown: ScoreContribution[];
}

/**
 * Weighted composite score out of 300, driven by which sources are granted.
 * A denied/expired source contributes 0 but still shows its weight, so the
 * "authorized sources contribute more" hint has something concrete to point to.
 */
export function computeWeightedScore(grantedSources: Set<DataConsentSource>): ComputedScore {
  const breakdown: ScoreContribution[] = ALL_CONSENT_SOURCES.map((source) => ({
    source,
    weight: SOURCE_WEIGHT[source],
    contribution: grantedSources.has(source) ? Math.round(SOURCE_WEIGHT[source] * 300) : 0,
  }));
  const scoreOutOf300 = breakdown.reduce((sum, entry) => sum + entry.contribution, 0);
  const tier: CreditTier = scoreOutOf300 >= 240 ? 'A' : scoreOutOf300 >= 180 ? 'B' : scoreOutOf300 >= 100 ? 'C' : 'D';
  return { scoreOutOf300, tier, breakdown };
}
