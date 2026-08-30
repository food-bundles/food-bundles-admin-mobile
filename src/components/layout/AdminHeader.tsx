import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { AccountAvatarButton } from './AccountAvatarButton';

export interface AdminHeaderProps {
  title: string;
  avatarUri: string;
  unreadCount: number;
  onBellPress: () => void;
  /** Renders a back arrow left of the title (calling router.back()) instead of the hamburger. */
  showBack?: boolean;
}

/** Sticky top header: hamburger (or back arrow) + title + bell + avatar. Does not scroll with content. */
export function AdminHeader({ title, avatarUri, unreadCount, onBellPress, showBack = false }: AdminHeaderProps) {
  const { colors } = useTheme();
  const t = useT();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View style={[styles.wrap, { backgroundColor: colors.paper, paddingTop: insets.top, borderColor: colors.hairline }]}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </Pressable>
      ) : (
        <Pressable onPress={openDrawer} accessibilityRole="button" accessibilityLabel={t('a11y.openMenu')} style={styles.iconButton}>
          <Ionicons name="menu" size={24} color={colors.ink} />
        </Pressable>
      )}
      <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        <NotificationBell unreadCount={unreadCount} onPress={onBellPress} />
        <AccountAvatarButton avatarUri={avatarUri} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
  },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
