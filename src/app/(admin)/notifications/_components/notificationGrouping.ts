import type { AdminNotification } from '@/mocks/notifications';

export type NotificationGroupKey = 'today' | 'yesterday' | 'earlierThisWeek' | 'older';

export interface NotificationGroup {
  key: NotificationGroupKey;
  items: AdminNotification[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Buckets notifications into Today / Yesterday / Earlier this week / Older, newest-first within each. */
export function groupNotificationsByDay(notifications: AdminNotification[], now: number = Date.now()): NotificationGroup[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const yesterdayStart = todayStart - DAY_MS;
  const weekStart = todayStart - 7 * DAY_MS;

  const buckets: Record<NotificationGroupKey, AdminNotification[]> = {
    today: [],
    yesterday: [],
    earlierThisWeek: [],
    older: [],
  };

  const sorted = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  for (const notification of sorted) {
    const time = new Date(notification.timestamp).getTime();
    if (time >= todayStart) buckets.today.push(notification);
    else if (time >= yesterdayStart) buckets.yesterday.push(notification);
    else if (time >= weekStart) buckets.earlierThisWeek.push(notification);
    else buckets.older.push(notification);
  }

  return (['today', 'yesterday', 'earlierThisWeek', 'older'] as const)
    .map((key) => ({ key, items: buckets[key] }))
    .filter((group) => group.items.length > 0);
}
