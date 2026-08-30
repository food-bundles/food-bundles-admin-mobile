import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { AdminHeader } from './AdminHeader';

export interface AdminScreenProps {
  title: string;
  children: React.ReactNode;
}

export interface AdminScreenExtraProps {
  /** Back arrow in the header (44x44, chevron-back) calling router.back(). Default false. */
  showBack?: boolean;
}

/**
 * Wraps every (admin)/ screen's body with the sticky AdminHeader. The bottom edge is no longer
 * given a safe-area inset here — AdminShell now renders a persistent BottomNavBar below every
 * screen's content, and that bar (not the raw device edge) is the real bottom boundary, and it
 * already accounts for `insets.bottom` itself. Giving both the bar and this wrapper a bottom
 * inset would double the gap.
 */
export function AdminScreen({ title, children, showBack = false }: AdminScreenProps & AdminScreenExtraProps) {
  const { colors } = useTheme();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationsStore((state) => state.notifications.filter((n) => !n.read).length);

  return (
    <View style={[styles.root, { backgroundColor: colors.oat }]}>
      <AdminHeader
        title={title}
        avatarUri={user?.avatarUri ?? ''}
        unreadCount={unreadCount}
        showBack={showBack}
        onBellPress={() => router.push('/(admin)/notifications' as never)}
      />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});
