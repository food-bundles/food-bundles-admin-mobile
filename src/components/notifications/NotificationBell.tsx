import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, text, useTheme } from '@/theme';

export interface NotificationBellProps {
  unreadCount: number;
  onPress: () => void;
}

/** Header bell icon with a marigold unread-count dot, capped at "99+". */
export function NotificationBell({ unreadCount, onPress }: NotificationBellProps) {
  const { colors } = useTheme();
  const label = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={unreadCount > 0 ? `Notifications, ${label} unread` : 'Notifications'}
      style={styles.wrap}
    >
      <Ionicons name="notifications-outline" size={22} color={colors.ink} />
      {unreadCount > 0 ? (
        <View style={[styles.dot, { backgroundColor: colors.marigold }]}>
          <Text style={[styles.dotLabel, { color: colors.ink }]}>{label}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  dotLabel: { ...text.micro, fontSize: 9, lineHeight: 11 },
});
