import { StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { formatRwfNumber } from '@/lib/formatRwf';
import { StatCard } from '@/components/ui/StatCard';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';

/** 4 StatCards: Total, Active, Suspended, Pending Verification. */
export function RestaurantStats() {
  const t = useT();
  const total = MOCK_RESTAURANTS.length;
  const active = MOCK_RESTAURANTS.filter((r) => r.status === 'ACTIVE').length;
  const suspended = MOCK_RESTAURANTS.filter((r) => r.status === 'SUSPENDED').length;
  const pending = MOCK_RESTAURANTS.filter((r) => r.status === 'PENDING_VERIFICATION').length;

  return (
    <View style={styles.grid}>
      <View style={styles.tile}>
        <StatCard label={t('restaurants.total')} value={formatRwfNumber(total)} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('restaurants.active')} value={formatRwfNumber(active)} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('restaurants.suspended')} value={formatRwfNumber(suspended)} deltaTone={suspended > 0 ? 'chili' : undefined} />
      </View>
      <View style={styles.tile}>
        <StatCard label={t('restaurants.pendingVerification')} value={formatRwfNumber(pending)} deltaTone={pending > 0 ? 'chili' : undefined} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, paddingHorizontal: space.lg },
  tile: { width: '47%' },
});
