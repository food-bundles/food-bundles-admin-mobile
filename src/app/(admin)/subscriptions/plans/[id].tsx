import { Redirect } from 'expo-router';

/**
 * No standalone plan detail screen exists in the real dashboard — the
 * tabbed subscriptions/page.tsx already covers plan editing. Redirects
 * there instead of duplicating it.
 */
export default function PlanDetailScreen() {
  return <Redirect href="/(admin)/subscriptions" />;
}
