import type { ConsentRecord } from '@/mocks/loanApplications';
import type { DataConsentSource } from './creditScoring';

export type ConsentEventKind = 'GRANTED' | 'REVOKED' | 'EXPIRED';

export interface ConsentEvent {
  source: DataConsentSource;
  kind: ConsentEventKind;
  timestamp: string;
}

/**
 * Derives a consent activity log from a restaurant's consent records: a
 * GRANTED event at grantedAt for every granted source, plus an EXPIRED event
 * at expiresAt for any source whose grant has already lapsed. No separate
 * "consent events" mock exists yet, so this is computed from the same
 * consent[] data the Loan Application sheet already reads (Section 2),
 * rather than inventing a parallel event-log mock that could drift from it.
 */
export function deriveConsentActivity(consent: ConsentRecord[], now: Date = new Date()): ConsentEvent[] {
  const events: ConsentEvent[] = [];

  for (const record of consent) {
    if (record.granted && record.grantedAt) {
      events.push({ source: record.source, kind: 'GRANTED', timestamp: record.grantedAt });
    }
    if (record.granted && record.expiresAt && new Date(record.expiresAt).getTime() < now.getTime()) {
      events.push({ source: record.source, kind: 'EXPIRED', timestamp: record.expiresAt });
    }
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
