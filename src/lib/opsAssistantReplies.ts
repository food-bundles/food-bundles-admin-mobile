import type { OpsIntent } from './chatSimulator';
import { detectOpsIntent } from './chatSimulator';
import type { TranslationKey } from '@/i18n';

/** Canned ops-focused answer per detected intent, keyed by i18n key so all 3 languages stay covered. */
const REPLY_KEY: Record<OpsIntent, TranslationKey> = {
  loan: 'opsAssistant.replyLoan',
  stock: 'opsAssistant.replyStock',
  orders: 'opsAssistant.replyOrders',
  markets: 'opsAssistant.replyMarkets',
  wallet: 'opsAssistant.replyWallet',
  reports: 'opsAssistant.replyReports',
  default: 'opsAssistant.replyDefault',
};

/** Picks the canned reply key for a given admin question, based on simple keyword matching. */
export function pickOpsReplyKey(question: string): TranslationKey {
  return REPLY_KEY[detectOpsIntent(question)];
}

export interface SuggestedQuestion {
  id: string;
  labelKey: TranslationKey;
}

/** Quick-reply chips shown above the composer so admins can tap a common ops question instead of typing. */
export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: 'loan', labelKey: 'opsAssistant.suggestLoan' },
  { id: 'stock', labelKey: 'opsAssistant.suggestStock' },
  { id: 'orders', labelKey: 'opsAssistant.suggestOrders' },
  { id: 'markets', labelKey: 'opsAssistant.suggestMarkets' },
];
