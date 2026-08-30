import type { en as enTable } from './en';
import { frScreens } from './frScreens';
import { frUsers } from './frUsers';
import { frStock } from './frStock';
import { frMarkets } from './frMarkets';
import { frFinancial } from './frFinancial';
import { frOperations } from './frOperations';
import { frSettings } from './frSettings';
import { frNotifications } from './frNotifications';
import { frConsent } from './frConsent';
import { frBranding } from './frBranding';

type ChromeKey = Exclude<
  keyof typeof enTable,
  | keyof typeof frScreens
  | keyof typeof frUsers
  | keyof typeof frStock
  | keyof typeof frMarkets
  | keyof typeof frFinancial
  | keyof typeof frOperations
  | keyof typeof frSettings
  | keyof typeof frNotifications
  | keyof typeof frConsent
  | keyof typeof frBranding
>;

const frChrome: Record<ChromeKey, string> = {
  'nav.dashboard': 'Tableau de bord',
  'nav.orders': 'Commandes',
  'nav.users': 'Utilisateurs',
  'nav.stock': 'Stock',
  'nav.markets': 'Marchés',
  'nav.vouchers': 'Bons & Prêts',
  'nav.deposits': 'Dépôts & Portefeuilles',
  'nav.subscriptions': 'Abonnements',
  'nav.promos': 'Codes promo',
  'nav.invitations': 'Invitations',
  'nav.newsletter': 'Newsletter',
  'nav.farmerSub': 'Soumissions des agriculteurs',
  'nav.contactSub': 'Messages de contact',
  'nav.reports': 'Rapports',
  'nav.settings': 'Paramètres',

  'section.financial': 'Finance',
  'section.operations': 'Opérations',

  'user.restaurants': 'Restaurants',
  'user.farmers': 'Agriculteurs',
  'user.affiliators': 'Affiliés',
  'user.admins': 'Administrateurs',
  'user.lookup': 'Recherche d’utilisateur',

  'stock.products': 'Produits',
  'stock.categories': 'Catégories',
  'stock.units': 'Unités',
  'stock.fbReports': 'Rapports F&B',

  'market.pricing': 'Prix du marché',

  'settings.authenticator': 'Authentificateur (2FA)',
  'settings.notificationRecipients': 'Destinataires des notifications',

  'status.pending': 'En attente',
  'status.confirmed': 'Confirmée',
  'status.preparing': 'En préparation',
  'status.ready': 'Prête',
  'status.inTransit': 'En transit',
  'status.delivered': 'Livrée',
  'status.cancelled': 'Annulée',
  'status.refunded': 'Remboursée',

  'role.superuser': 'Super-administrateur',
  'role.admin': 'Administrateur',
  'role.aggregator': 'Agrégateur',
  'role.logistics': 'Logistique',
  'role.trader': 'Commerçant',

  'common.loading': 'Chargement...',
  'common.error': 'Une erreur est survenue',
  'common.retry': 'Réessayer',
  'common.noData': 'Aucun résultat',
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.delete': 'Supprimer',
  'common.confirm': 'Confirmer',
  'common.back': 'Retour',
  'common.search': 'Rechercher',
  'common.filter': 'Filtrer',
  'common.export': 'Exporter',
  'common.refresh': 'Actualiser',
  'common.viewAll': 'Voir tout',
  'common.approve': 'Approuver',
  'common.reject': 'Rejeter',
  'common.suspend': 'Suspendre',
  'common.activate': 'Activer',
  'common.pendingCount': '{{count}} en attente',

  'a11y.goBack': 'Retour',
  'a11y.close': 'Fermer',
  'a11y.openMenu': 'Ouvrir le menu',
  'a11y.prevPage': 'Page précédente',
  'a11y.nextPage': 'Page suivante',

  'pagination.pageOfTotal': 'Page {{page}} sur {{total}}',

  'date.justNow': 'À l’instant',
  'date.minAgo': 'Il y a {{count}} min',
  'date.hoursAgo': 'Il y a {{count}} h',
  'date.yesterday': 'Hier',
};

export const fr: Record<keyof typeof enTable, string> = {
  ...frChrome,
  ...frScreens,
  ...frUsers,
  ...frStock,
  ...frMarkets,
  ...frFinancial,
  ...frOperations,
  ...frSettings,
  ...frNotifications,
  ...frConsent,
  ...frBranding,
};
