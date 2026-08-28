import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRelative } from '@/lib/date';
import type { AdminNotification } from '@/mocks/notifications';
import { renderChannelIcon } from './channelIcon';

export interface NotificationRowProps {
  notification: AdminNotification;
  onPress: () => void;
  onDelete: () => void;
}

/** One notification row: image or channel icon, title/body, relative time, unread dot, delete action. */
export function NotificationRow({ notification, onPress, onDelete }: NotificationRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const timeLabel = formatRelative(notification.timestamp, language, t);
  const readLabel = notification.read ? t('notifications.readLabel') : t('notifications.unreadLabel');

  const onRowPress = () => {
    onPress();
    router.push(notification.deepLink as never);
  };

  return (
    <View style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <Pressable
        onPress={onRowPress}
        accessibilityRole="button"
        accessibilityLabel={`${notification.title}, ${readLabel}`}
        style={styles.pressable}
      >
        {notification.imageUri ? (
          <Image source={{ uri: notification.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>
            {renderChannelIcon(notification.channel, colors.leaf)}
          </View>
        )}
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: notification.read ? colors.secondary : colors.ink }]}>{notification.title}</Text>
          <Text style={[styles.body, { color: colors.secondary }]} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={[styles.time, { color: colors.muted }]}>{timeLabel}</Text>
        </View>
        {!notification.read ? <View style={[styles.dot, { backgroundColor: colors.marigold }]} /> : null}
      </Pressable>
      <Pressable onPress={onDelete} accessibilityRole="button" accessibilityLabel={t('common.delete')} style={styles.deleteButton}>
        <Ionicons name="close" size={18} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  pressable: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, flex: 1 },
  image: { width: 48, height: 48, borderRadius: radius.sm + 2 },
  iconWrap: { width: 48, height: 48, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: 2 },
  time: { ...text.micro, marginTop: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  deleteButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
});
