import type { en as enTable } from './en';
import { rwScreens } from './rwScreens';
import { rwUsers } from './rwUsers';
import { rwStock } from './rwStock';
import { rwMarkets } from './rwMarkets';
import { rwFinancial } from './rwFinancial';
import { rwOperations } from './rwOperations';
import { rwSettings } from './rwSettings';
import { rwNotifications } from './rwNotifications';
import { rwConsent } from './rwConsent';
import { rwBranding } from './rwBranding';
import { rwExpand } from './rwExpand';
import { rwOrderBehalf } from './rwOrderBehalf';
import { rwImages } from './rwImages';
import { rwProductDetail } from './rwProductDetail';
import { rwReports } from './rwReports';
import { rwFinancialBehalf } from './rwFinancialBehalf';
import { rwContactChat } from './rwContactChat';
import { rwRecipientHistory } from './rwRecipientHistory';

type ChromeKey = Exclude<
  keyof typeof enTable,
  | keyof typeof rwScreens
  | keyof typeof rwUsers
  | keyof typeof rwStock
  | keyof typeof rwMarkets
  | keyof typeof rwFinancial
  | keyof typeof rwOperations
  | keyof typeof rwSettings
  | keyof typeof rwNotifications
  | keyof typeof rwConsent
  | keyof typeof rwBranding
  | keyof typeof rwExpand
  | keyof typeof rwOrderBehalf
  | keyof typeof rwImages
  | keyof typeof rwProductDetail
  | keyof typeof rwReports
  | keyof typeof rwFinancialBehalf
  | keyof typeof rwContactChat
  | keyof typeof rwRecipientHistory
>;

const rwChrome: Record<ChromeKey, string> = {
  'nav.dashboard': 'Ikibaho',
  'nav.orders': 'Ibyatumijwe',
  'nav.users': 'Abakoresha',
  'nav.stock': 'Ububiko',
  'nav.markets': 'Amasoko',
  'nav.vouchers': 'Ivoucher n’Inguzanyo',
  'nav.deposits': 'Kubika n’Amakofi',
  'nav.subscriptions': 'Ubwiyandikishe',
  'nav.promos': 'Kode z’Ibiciro',
  'nav.invitations': 'Ubutumire',
  'nav.newsletter': 'Amakuru',
  'nav.farmerSub': 'Ibyatanzwe n’Abahinzi',
  'nav.contactSub': 'Ubutumwa bw’Abaturage',
  'nav.reports': 'Raporo',
  'nav.settings': 'Igenamiterere',

  'section.financial': 'Imari',
  'section.operations': 'Ibikorwa',

  'user.restaurants': 'Amaresitora',
  'user.farmers': 'Abahinzi',
  'user.affiliators': 'Abafatanyabikorwa',
  'user.admins': 'Abayobozi',
  'user.lookup': 'Gushakisha Ukoresha',

  'stock.products': 'Ibicuruzwa',
  'stock.categories': 'Ibyiciro',
  'stock.units': 'Ibipimo',
  'stock.fbReports': 'Raporo za F&B',

  'market.pricing': 'Ibiciro by’Isoko',

  'settings.authenticator': 'Kwemeza Kabiri (2FA)',
  'settings.notificationRecipients': 'Ababona Amatangazo',

  'status.pending': 'Bitegereje',
  'status.confirmed': 'Byemejwe',
  'status.preparing': 'Birategurwa',
  'status.ready': 'Biriteguye',
  'status.inTransit': 'Biri mu nzira',
  'status.delivered': 'Byatanzwe',
  'status.cancelled': 'Byahagaritswe',
  'status.refunded': 'Byasubijwe',

  'role.superuser': 'Umuyobozi mukuru',
  'role.admin': 'Umuyobozi',
  'role.aggregator': 'Ukoranya',
  'role.logistics': 'Ushinzwe ibikorwa',
  'role.trader': 'Umucuruzi',

  'common.loading': 'Birimo gutegurwa...',
  'common.error': 'Habaye ikibazo',
  'common.retry': 'Ongera ugerageze',
  'common.noData': 'Nta bisubizo',
  'common.save': 'Bika',
  'common.cancel': 'Hagarika',
  'common.delete': 'Siba',
  'common.confirm': 'Emeza',
  'common.back': 'Subira inyuma',
  'common.search': 'Shakisha',
  'common.filter': 'Yungurura',
  'common.export': 'Kwohereza',
  'common.refresh': 'Vugurura',
  'common.viewAll': 'Reba byose',
  'common.approve': 'Emeza',
  'common.reject': 'Anga',
  'common.suspend': 'Hagarika',
  'common.activate': 'Fungura',
  'common.pendingCount': '{{count}} bitegereje',

  'a11y.goBack': 'Subira inyuma',
  'a11y.close': 'Funga',
  'a11y.openMenu': 'Fungura urutonde',
  'a11y.prevPage': 'Ipaji ibanziriza',
  'a11y.nextPage': 'Ipaji ikurikira',

  'pagination.pageOfTotal': 'Ipaji ya {{page}} kuri {{total}}',

  'date.justNow': 'Ubu nonaha',
  'date.minAgo': 'Iminota {{count}} ishize',
  'date.hoursAgo': 'Amasaha {{count}} ashize',
  'date.yesterday': 'Ejo hashize',
};

export const rw: Record<keyof typeof enTable, string> = {
  ...rwChrome,
  ...rwScreens,
  ...rwUsers,
  ...rwStock,
  ...rwMarkets,
  ...rwFinancial,
  ...rwOperations,
  ...rwSettings,
  ...rwNotifications,
  ...rwConsent,
  ...rwBranding,
  ...rwExpand,
  ...rwOrderBehalf,
  ...rwImages,
  ...rwProductDetail,
  ...rwReports,
  ...rwFinancialBehalf,
  ...rwContactChat,
  ...rwRecipientHistory,
};
