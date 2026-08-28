import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import type { NotificationChannel } from '@/mocks/notifications';
import { NotificationRow } from './_components/NotificationRow';
import { groupNotificationsByDay, type NotificationGroupKey } from './_components/notificationGrouping';

type FilterKey = 'all' | NotificationChannel;

const GROUP_LABEL_KEY: Record<NotificationGroupKey, TranslationKey> = {
  today: 'notifications.groupToday',
  yesterday: 'notifications.groupYesterday',
  earlierThisWeek: 'notifications.groupEarlierWeek',
  older: 'notifications.groupOlder',
};

const FILTER_LABEL_KEY: Record<FilterKey, TranslationKey> = {
  all: 'notifications.filterAll',
  orders: 'notifications.filterOrders',
  vouchers: 'notifications.filterVouchers',
  submissions: 'notifications.filterSubmissions',
  stock: 'notifications.filterStock',
  system: 'notifications.filterSystem',
  users: 'notifications.filterUsers',
};

const FILTER_ORDER: FilterKey[] = ['all', 'orders', 'vouchers', 'submissions', 'stock', 'system', 'users'];

/** Notification centre: channel-filtered, day-grouped list. Built from the restaurant app's real notifications screen. */
export default function NotificationsScreen() {
  const { colors } = useTheme();
  const t = useT();
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markRead = useNotificationsStore((state) => state.markRead);
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.channel === filter);
  const groups = groupNotificationsByDay(filtered);

  const chips: FilterChip[] = FILTER_ORDER.map((key) => ({ key, label: t(FILTER_LABEL_KEY[key]) }));

  return (
    <AdminScreen title={t('notifications.title')}>
      <View style={styles.headerRow}>
        <View style={styles.filterWrap}>
          <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as FilterKey)} />
        </View>
        {unreadCount > 0 ? (
          <Pressable onPress={markAllRead} accessibilityRole="button" accessibilityLabel={t('notifications.markAllRead')} style={styles.markAllButton}>
            <Text style={[styles.markAllLabel, { color: colors.leaf }]}>{t('notifications.markAllRead')}</Text>
          </Pressable>
        ) : null}
      </View>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Ionicons name={filter === 'all' ? 'checkmark-circle-outline' : 'notifications-outline'} size={22} color={colors.leaf} />}
          title={filter === 'all' ? t('notifications.allCaughtUp') : t('notifications.channelEmpty', { channel: t(FILTER_LABEL_KEY[filter]) })}
          message={t('notifications.emptyMessage')}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {groups.map((group) => (
            <View key={group.key} style={styles.groupGap}>
              <Text style={[styles.groupLabel, { color: colors.secondary }]}>{t(GROUP_LABEL_KEY[group.key])}</Text>
              {group.items.map((item) => (
                <View key={item.id} style={styles.rowGap}>
                  <NotificationRow notification={item} onPress={() => markRead(item.id)} onDelete={() => deleteNotification(item.id)} />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: space.lg },
  filterWrap: { flex: 1 },
  markAllButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  markAllLabel: { ...text.label },
  scrollContent: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
  groupGap: { marginBottom: space.md },
  groupLabel: { ...text.overline, marginBottom: space.sm },
  rowGap: { marginBottom: space.sm },
});
