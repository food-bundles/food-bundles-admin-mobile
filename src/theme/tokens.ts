export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, section: 40 } as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const shadow = {
  card: {
    shadowColor: '#14221A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#14221A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

/** Minimum tap target, every platform. */
export const hit = { min: 44 } as const;

/**
 * Order status colour treatment — exact, no drift. Keys match the 8
 * real order-status values found in `order-colmuns.tsx` on the web
 * dashboard. Values reference palette token names, resolved via
 * `useTheme()` at the call site (never hardcoded hex here).
 */
export const ORDER_STATUS_TOKEN = {
  PENDING: { bg: 'disabledLine', text: 'ink' },
  CONFIRMED: { bg: 'hairline', text: 'secondary' },
  PREPARING: { bg: 'tintMarigold', text: 'tintedAmberText' },
  READY: { bg: 'tintRipe', text: 'ripe' },
  IN_TRANSIT: { bg: 'tintLeaf', text: 'leaf' },
  DELIVERED: { bg: 'pine', text: 'paper' },
  CANCELLED: { bg: 'tintChili', text: 'chili' },
  REFUNDED: { bg: 'paper', text: 'chili', borderColor: 'chili' },
} as const;

/**
 * Admin role badge colour treatment. Keys match the real 5-role model
 * found in `create-admin-modal.tsx` (SUPERUSER/ADMIN/AGGREGATOR/
 * LOGISTICS/TRADER) — not CLAUDE.md's stated 3-role model. See
 * PROGRESS.md "Decisions taken autonomously".
 */
export const ROLE_BADGE_TOKEN = {
  SUPERUSER: { bg: 'pine', text: 'paper' },
  ADMIN: { bg: 'leaf', text: 'paper' },
  AGGREGATOR: { bg: 'tintLeaf', text: 'leaf' },
  LOGISTICS: { bg: 'tintMarigold', text: 'tintedAmberText' },
  TRADER: { bg: 'neutral', text: 'secondary' },
} as const;
