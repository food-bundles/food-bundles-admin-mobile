/** Resolves after `ms` milliseconds. Shared by every mocked-async flow (OTP, chat delivery, replies). */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const DELIVERY_DELAY_MS = 500;
const READ_DELAY_MS = 1800;
const TYPING_MIN_MS = 900;
const TYPING_MAX_MS = 2400;

/** Random delay in [min, max], used so simulated typing/reply timing never feels mechanical. */
function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Simulates a delivery receipt landing shortly after send. */
export async function simulateDelivery(onDelivered: () => void): Promise<void> {
  await sleep(DELIVERY_DELAY_MS);
  onDelivered();
}

/** Simulates the other party reading the message a little after delivery. */
export async function simulateRead(onRead: () => void): Promise<void> {
  await sleep(DELIVERY_DELAY_MS + READ_DELAY_MS);
  onRead();
}

/** Runs a typing-indicator window (onStart/onStop) before resolving, so callers can await it and then push a reply. */
export async function simulateTyping(onStart: () => void, onStop: () => void): Promise<void> {
  onStart();
  await sleep(randomBetween(TYPING_MIN_MS, TYPING_MAX_MS));
  onStop();
}

const RESTAURANT_CANNED_REPLIES: string[] = [
  'Got it, thank you for the update!',
  "That works for us — we'll keep an eye out.",
  'Appreciate the quick response.',
  'Understood, please keep us posted.',
  "We'll check and get back to you if anything changes.",
];

/** Generates a plausible restaurant-side reply for the peer-chat simulator. Deterministic-ish via message count seed. */
export function generateCannedReply(seed: number): string {
  return RESTAURANT_CANNED_REPLIES[seed % RESTAURANT_CANNED_REPLIES.length];
}

export type OpsIntent = 'loan' | 'stock' | 'orders' | 'markets' | 'wallet' | 'reports' | 'default';

const OPS_KEYWORDS: Record<Exclude<OpsIntent, 'default'>, string[]> = {
  loan: ['loan', 'voucher', 'credit'],
  stock: ['stock', 'inventory', 'reorder', 'low'],
  orders: ['order', 'delivery', 'status'],
  markets: ['market', 'price', 'pricing'],
  wallet: ['wallet', 'deposit', 'withdraw', 'balance'],
  reports: ['report', 'analytics', 'sales'],
};

/** Very small keyword matcher used by the ops-assistant chat to pick a canned answer bucket. */
export function detectOpsIntent(text: string): OpsIntent {
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(OPS_KEYWORDS) as [Exclude<OpsIntent, 'default'>, string[]][]) {
    if (keywords.some((keyword) => lower.includes(keyword))) return intent;
  }
  return 'default';
}
