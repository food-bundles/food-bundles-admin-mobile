import { Redirect } from 'expo-router';

/**
 * No standalone market detail screen exists in the real dashboard — the
 * spec only describes the tabbed markets/page.tsx (Markets | Prices |
 * Analysis | Comparison), which already covers per-market pricing.
 * Redirects to the tabbed screen instead of duplicating it.
 */
export default function MarketDetailScreen() {
  return <Redirect href="/(admin)/markets" />;
}
