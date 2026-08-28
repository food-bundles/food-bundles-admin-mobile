import { useMemo } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { MOCK_AFFILIATORS } from '@/mocks/affiliators';

/**
 * No standalone affiliator detail screen exists in the real dashboard —
 * affiliators are managed from the owning restaurant's Affiliators tab.
 * Redirects there instead of duplicating that screen.
 */
export default function AffiliatorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const affiliator = useMemo(() => MOCK_AFFILIATORS.find((a) => a.id === id), [id]);

  return <Redirect href={affiliator ? `/(admin)/users/restaurants/${affiliator.restaurantId}` : '/(admin)/users/affiliators'} />;
}
