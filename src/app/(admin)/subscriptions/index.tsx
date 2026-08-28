import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { SubscriptionTabs, type SubscriptionTabKey } from './_components/SubscriptionTabs';
import { PlansTab } from './_components/PlansTab';
import { RestaurantSubscriptionsTab } from './_components/RestaurantSubscriptionsTab';

/** Subscriptions: Plans | Restaurant Subscriptions tabs. Built from subscriptions/page.tsx. */
export default function SubscriptionsScreen() {
  useRoleGuard('financial');
  const t = useT();
  const [tab, setTab] = useState<SubscriptionTabKey>('plans');

  return (
    <AdminScreen title={t('subscriptions.title')}>
      <SubscriptionTabs active={tab} onChange={setTab} />
      {tab === 'plans' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <PlansTab />
        </ScrollView>
      ) : (
        <RestaurantSubscriptionsTab />
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
