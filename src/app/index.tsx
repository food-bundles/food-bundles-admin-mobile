import { Redirect } from 'expo-router';

/**
 * Root entry redirect. Phase 0 placeholder — always routes to the
 * dashboard. Phase 3 replaces this with an authStore-aware redirect
 * to (auth)/login when there is no active session.
 */
export default function Index() {
  return <Redirect href="/(admin)/dashboard" />;
}
