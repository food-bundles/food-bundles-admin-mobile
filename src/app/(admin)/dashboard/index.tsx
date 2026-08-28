import { Text, View } from 'react-native';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { useT } from '@/i18n';

/** Placeholder dashboard home screen. Built out in Phase 6 — Dashboard home. */
export default function DashboardHome() {
  const t = useT();
  return (
    <AdminScreen title={t('nav.dashboard')}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Dashboard — Phase 6</Text>
      </View>
    </AdminScreen>
  );
}
