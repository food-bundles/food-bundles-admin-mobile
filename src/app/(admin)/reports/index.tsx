import { Redirect } from 'expo-router';

/**
 * No distinct "Reports" screen spec exists anywhere in the skills — the
 * navigation skill lists this route but the drawer's visible section list
 * (component-library skill) has no matching item, and `stock/fb-reports`
 * is the only reports screen with a real spec. Redirects there instead of
 * building a duplicate.
 */
export default function ReportsScreen() {
  return <Redirect href="/(admin)/stock/fb-reports" />;
}
