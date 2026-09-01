import { MOCK_ADMINS, type AdminRecord } from '@/mocks/admins';

export type VerificationResult = 'SUCCESS' | 'FAILED';

export interface TeamTwoFactorStatus {
  admin: AdminRecord;
  enabled: boolean;
  lastUsedAt: string | null;
}

export interface ActivityEntry {
  id: string;
  admin: AdminRecord;
  timestamp: string;
  ip: string;
  result: VerificationResult;
}

/** Deterministic per-admin 2FA enabled/disabled mock, seeded from the admin id so it's stable across renders. */
export function teamTwoFactorStatuses(): TeamTwoFactorStatus[] {
  return MOCK_ADMINS.map((admin, index) => {
    const enabled = index % 3 !== 2; // 2 of every 3 admins enabled — plausible mixed team state
    const lastUsedAt = enabled ? new Date(Date.now() - (index + 1) * 5 * 3_600_000).toISOString() : null;
    return { admin, enabled, lastUsedAt };
  });
}

/** Mock last-10 2FA verification events across all admins, newest first. */
export function teamActivityLog(): ActivityEntry[] {
  const now = Date.now();
  return Array.from({ length: 10 }, (_, i) => {
    const admin = MOCK_ADMINS[i % MOCK_ADMINS.length];
    const failed = i % 4 === 3;
    return {
      id: `2fa-log-${i}`,
      admin,
      timestamp: new Date(now - i * 2 * 3_600_000).toISOString(),
      ip: `41.186.${(i * 7) % 255}.${(i * 13) % 255}`,
      result: failed ? 'FAILED' : 'SUCCESS',
    };
  });
}

/** Successful verification count per day for the last 7 days, across all admins. */
export function verificationsPerDay(): { x: number; y: number }[] {
  const log = teamActivityLog();
  const buckets = new Array(7).fill(0);
  const now = Date.now();
  for (const entry of log) {
    if (entry.result !== 'SUCCESS') continue;
    const dayIndex = 6 - Math.floor((now - new Date(entry.timestamp).getTime()) / 86_400_000);
    if (dayIndex >= 0 && dayIndex < 7) buckets[dayIndex] += 1;
  }
  return buckets.map((y, x) => ({ x, y }));
}
