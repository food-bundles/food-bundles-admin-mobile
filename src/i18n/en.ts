import { enScreens } from './enScreens';
import { enUsers } from './enUsers';
import { enStock } from './enStock';
import { enMarkets } from './enMarkets';

const enChrome = {
  'nav.dashboard': 'Dashboard',
  'nav.orders': 'Orders',
  'nav.users': 'Users',
  'nav.stock': 'Stock',
  'nav.markets': 'Markets',
  'nav.vouchers': 'Vouchers & Loans',
  'nav.deposits': 'Deposits & Wallets',
  'nav.subscriptions': 'Subscriptions',
  'nav.promos': 'Promo Codes',
  'nav.invitations': 'Invitations',
  'nav.newsletter': 'Newsletter',
  'nav.farmerSub': 'Farmer Submissions',
  'nav.contactSub': 'Contact Submissions',
  'nav.reports': 'Reports',
  'nav.settings': 'Settings',

  'section.financial': 'Financial',
  'section.operations': 'Operations',

  'user.restaurants': 'Restaurants',
  'user.farmers': 'Farmers',
  'user.affiliators': 'Affiliators',
  'user.admins': 'Administrators',
  'user.lookup': 'User Lookup',

  'stock.products': 'Products',
  'stock.categories': 'Categories',
  'stock.units': 'Units',
  'stock.fbReports': 'F&B Reports',

  'market.pricing': 'Market Pricing',

  'settings.authenticator': 'Authenticator (2FA)',
  'settings.notificationRecipients': 'Notification Recipients',

  'status.pending': 'Pending',
  'status.confirmed': 'Confirmed',
  'status.preparing': 'Preparing',
  'status.ready': 'Ready',
  'status.inTransit': 'In Transit',
  'status.delivered': 'Delivered',
  'status.cancelled': 'Cancelled',
  'status.refunded': 'Refunded',

  'role.superuser': 'Superuser',
  'role.admin': 'Admin',
  'role.aggregator': 'Aggregator',
  'role.logistics': 'Logistics',
  'role.trader': 'Trader',

  'common.loading': 'Loading...',
  'common.error': 'Something went wrong',
  'common.retry': 'Try again',
  'common.noData': 'No results',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.confirm': 'Confirm',
  'common.back': 'Back',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.export': 'Export',
  'common.refresh': 'Refresh',
  'common.viewAll': 'View all',
  'common.approve': 'Approve',
  'common.reject': 'Reject',
  'common.suspend': 'Suspend',
  'common.activate': 'Activate',
  'common.pendingCount': '{{count}} pending',

  'a11y.goBack': 'Go back',
  'a11y.close': 'Close',
  'a11y.openMenu': 'Open menu',
  'a11y.prevPage': 'Previous page',
  'a11y.nextPage': 'Next page',

  'pagination.pageOfTotal': 'Page {{page}} of {{total}}',

  'date.justNow': 'Just now',
  'date.minAgo': '{{count}} min ago',
  'date.hoursAgo': '{{count}}h ago',
  'date.yesterday': 'Yesterday',
} as const;

export const en = { ...enChrome, ...enScreens, ...enUsers, ...enStock, ...enMarkets };

export type TranslationKey = keyof typeof en;
