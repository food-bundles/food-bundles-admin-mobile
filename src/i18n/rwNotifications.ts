import type { enNotifications } from './enNotifications';

export const rwNotifications: Record<keyof typeof enNotifications, string> = {
  'notifications.title': 'Amatangazo',
  'notifications.markAllRead': 'Byose byasomwe',
  'notifications.readLabel': 'byasomwe',
  'notifications.unreadLabel': 'bitarasomwa',
  'notifications.groupToday': 'Uyu munsi',
  'notifications.groupYesterday': 'Ejo hashize',
  'notifications.groupEarlierWeek': 'Ku ntangiriro z’icyumweru',
  'notifications.groupOlder': 'Ibindi',
  'notifications.filterAll': 'Byose',
  'notifications.filterOrders': 'Ibyatumijwe',
  'notifications.filterVouchers': 'Ivoucher',
  'notifications.filterSubmissions': 'Ibyatanzwe',
  'notifications.filterStock': 'Ububiko',
  'notifications.filterSystem': 'Sisitemu',
  'notifications.filterUsers': 'Abakoresha',
  'notifications.allCaughtUp': 'Nta bindi bisigaye',
  'notifications.emptyMessage': 'Amatangazo mashya azagaragara hano.',
  'notifications.channelEmpty': 'Nta matangazo ya {{channel}}',
};
