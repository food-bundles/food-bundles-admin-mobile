import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_RESTAURANTS, type RestaurantStatus } from '@/mocks/restaurants';
import { RestaurantTabs, type RestaurantTabKey } from './_components/RestaurantTabs';
import { RestaurantInfoTab } from './_components/RestaurantInfoTab';
import { RestaurantOrdersTab } from './_components/RestaurantOrdersTab';
import { RestaurantWalletTab } from './_components/RestaurantWalletTab';
import { RestaurantAffiliatorsTab } from './_components/RestaurantAffiliatorsTab';
import { RestaurantVouchersTab } from './_components/RestaurantVouchersTab';

/** Restaurant detail: Info | Orders | Wallet | Affiliators | Vouchers tabs. */
export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const baseRestaurant = useMemo(() => MOCK_RESTAURANTS.find((r) => r.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<RestaurantStatus | null>(null);
  const restaurant = baseRestaurant && statusOverride ? { ...baseRestaurant, status: statusOverride } : baseRestaurant;
  const [tab, setTab] = useState<RestaurantTabKey>('info');

  if (!restaurant) {
    return (
      <AdminScreen title={t('restaurants.title')}>
        <EmptyState icon={null} title={t('restaurants.emptyTitle')} message={t('restaurants.emptyMessage')} />
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={restaurant.name}>
      <RestaurantTabs active={tab} onChange={setTab} />
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'info' ? (
          <RestaurantInfoTab
            restaurant={restaurant}
            onToggleSuspend={() => setStatusOverride(restaurant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
          />
        ) : null}
        {tab === 'orders' ? <RestaurantOrdersTab restaurantId={restaurant.id} /> : null}
        {tab === 'wallet' ? <RestaurantWalletTab restaurantId={restaurant.id} /> : null}
        {tab === 'affiliators' ? <RestaurantAffiliatorsTab restaurantId={restaurant.id} restaurantName={restaurant.name} /> : null}
        {tab === 'vouchers' ? <RestaurantVouchersTab restaurantId={restaurant.id} /> : null}
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
});
