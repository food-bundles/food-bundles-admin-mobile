import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { AdminHeader } from './AdminHeader';

export interface AdminScreenProps {
  title: string;
  children: React.ReactNode;
}

/** Wraps every (admin)/ screen's body with the sticky AdminHeader + safe-area bottom inset. */
export function AdminScreen({ title, children }: AdminScreenProps) {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationsStore((state) => state.notifications.filter((n) => !n.read).length);

  return (
    <View style={[styles.root, { backgroundColor: colors.oat }]}>
      <AdminHeader
        title={title}
        avatarUri={user?.avatarUri ?? ''}
        unreadCount={unreadCount}
        onBellPress={() => router.push('/(admin)/notifications' as never)}
      />
      <SafeAreaView edges={['bottom']} style={styles.body}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});
