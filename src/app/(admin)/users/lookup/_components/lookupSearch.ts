import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';
import { MOCK_FARMERS, type Farmer } from '@/mocks/farmers';
import { MOCK_AFFILIATORS, type Affiliator } from '@/mocks/affiliators';
import { MOCK_ADMINS, type AdminRecord } from '@/mocks/admins';

export type LookupResult =
  | { kind: 'restaurant'; record: Restaurant }
  | { kind: 'farmer'; record: Farmer }
  | { kind: 'affiliator'; record: Affiliator }
  | { kind: 'admin'; record: AdminRecord };

/** Searches every user-shaped mock collection by id, email, or phone. */
export function lookupUser(query: string): LookupResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: LookupResult[] = [];

  for (const record of MOCK_RESTAURANTS) {
    if (record.id.toLowerCase() === q || record.email.toLowerCase().includes(q) || record.phone.includes(q)) {
      results.push({ kind: 'restaurant', record });
    }
  }
  for (const record of MOCK_FARMERS) {
    if (record.id.toLowerCase() === q || record.email.toLowerCase().includes(q) || record.phone.includes(q)) {
      results.push({ kind: 'farmer', record });
    }
  }
  for (const record of MOCK_AFFILIATORS) {
    if (record.id.toLowerCase() === q || record.email.toLowerCase().includes(q) || record.phone.includes(q)) {
      results.push({ kind: 'affiliator', record });
    }
  }
  for (const record of MOCK_ADMINS) {
    if (record.id.toLowerCase() === q || record.email.toLowerCase().includes(q)) {
      results.push({ kind: 'admin', record });
    }
  }

  return results;
}
