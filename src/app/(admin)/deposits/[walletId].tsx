import { Redirect } from 'expo-router';

/**
 * No standalone wallet detail screen exists in the real dashboard — the
 * tabbed deposits/page.tsx already covers wallets/transactions/
 * withdrawals/delegation. Redirects there instead of duplicating it.
 */
export default function WalletDetailScreen() {
  return <Redirect href="/(admin)/deposits" />;
}
