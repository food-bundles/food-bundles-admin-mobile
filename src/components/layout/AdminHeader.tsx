import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export interface AdminHeaderProps {
  title: string;
  avatarUri: string;
  unreadCount: number;
  onBellPress: () => void;
}

/** Sticky top header: hamburger + title + bell + avatar. Does not scroll with content. */
export function AdminHeader({ title, avatarUri, unreadCount, onBellPress }: AdminHeaderProps) {
  const { colors } = useTheme();
  const t = useT();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View style={[styles.wrap, { backgroundColor: colors.paper, paddingTop: insets.top, borderColor: colors.hairline }]}>
      <Pressable onPress={openDrawer} accessibilityRole="button" accessibilityLabel={t('a11y.openMenu')} style={styles.iconButton}>
        <Ionicons name="menu" size={24} color={colors.ink} />
      </Pressable>
      <Text style={[styles.title, { color: colors.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        <NotificationBell unreadCount={unreadCount} onPress={onBellPress} />
        <Image source={{ uri: avatarUri }} style={styles.avatar} accessibilityLabel="Profile" />
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
  avatar: { width: 36, height: 36, borderRadius: 18 },
});
