import type { enNotifications } from './enNotifications';

export const frNotifications: Record<keyof typeof enNotifications, string> = {
  'notifications.title': 'Notifications',
  'notifications.markAllRead': 'Tout marquer comme lu',
  'notifications.readLabel': 'lu',
  'notifications.unreadLabel': 'non lu',
  'notifications.groupToday': 'Aujourd’hui',
  'notifications.groupYesterday': 'Hier',
  'notifications.groupEarlierWeek': 'Plus tôt cette semaine',
  'notifications.groupOlder': 'Plus ancien',
  'notifications.filterAll': 'Toutes',
  'notifications.filterOrders': 'Commandes',
  'notifications.filterVouchers': 'Bons',
  'notifications.filterSubmissions': 'Soumissions',
  'notifications.filterStock': 'Stock',
  'notifications.filterSystem': 'Système',
  'notifications.filterUsers': 'Utilisateurs',
  'notifications.allCaughtUp': 'Vous êtes à jour',
  'notifications.emptyMessage': 'Les nouvelles notifications apparaîtront ici.',
  'notifications.channelEmpty': 'Aucune notification {{channel}}',
};
