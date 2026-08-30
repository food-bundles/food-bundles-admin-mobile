import type { AdminRole } from '@/types/auth';

export type AdminStatus = 'ACTIVE' | 'SUSPENDED';

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  commission: number;
  status: AdminStatus;
  createdAt: string;
  /** Same pravatar.cc convention as MOCK_ADMIN in auth.ts, one distinct portrait id per admin. */
  avatarUri: string;
}

/**
 * 5 admin users covering the real 5-role model (SUPERUSER/ADMIN/AGGREGATOR/
 * LOGISTICS/TRADER) — not the mock-data skill's stated 3-role breakdown.
 */
export const MOCK_ADMINS: AdminRecord[] = [
  {
    id: 'admin-001',
    name: 'Patrick Nzeyimana',
    email: 'patrick@food.rw',
    role: 'SUPERUSER',
    commission: 0,
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00Z',
    avatarUri: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'admin-002',
    name: 'Chantal Umuhoza',
    email: 'chantal@food.rw',
    role: 'ADMIN',
    commission: 0,
    status: 'ACTIVE',
    createdAt: '2025-01-20T09:00:00Z',
    avatarUri: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'admin-003',
    name: 'Didier Kabera',
    email: 'didier@food.rw',
    role: 'AGGREGATOR',
    commission: 2.5,
    status: 'ACTIVE',
    createdAt: '2025-02-05T10:30:00Z',
    avatarUri: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 'admin-004',
    name: 'Solange Mutesi',
    email: 'solange@food.rw',
    role: 'LOGISTICS',
    commission: 0,
    status: 'ACTIVE',
    createdAt: '2025-02-18T11:15:00Z',
    avatarUri: 'https://i.pravatar.cc/150?img=29',
  },
  {
    id: 'admin-005',
    name: 'Aline Nyirahabimana',
    email: 'aline@food.rw',
    role: 'TRADER',
    commission: 1.5,
    status: 'ACTIVE',
    createdAt: '2025-03-01T07:45:00Z',
    avatarUri: 'https://i.pravatar.cc/150?img=44',
  },
];
