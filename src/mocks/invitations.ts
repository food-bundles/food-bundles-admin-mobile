import type { AdminRole } from '@/types/auth';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export interface Invitation {
  id: string;
  email: string;
  role: AdminRole;
  sentAt: string;
  expiresAt: string;
  status: InvitationStatus;
  sentBy: string;
}

/** 6 invitations: mix of PENDING, ACCEPTED, EXPIRED. */
export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: 'inv-001',
    email: 'new.admin@food.rw',
    role: 'ADMIN',
    sentAt: '2026-08-20T09:00:00Z',
    expiresAt: '2026-08-27T09:00:00Z',
    status: 'PENDING',
    sentBy: 'admin-001',
  },
  {
    id: 'inv-002',
    email: 'aggregator2@food.rw',
    role: 'AGGREGATOR',
    sentAt: '2026-08-10T10:00:00Z',
    expiresAt: '2026-08-17T10:00:00Z',
    status: 'ACCEPTED',
    sentBy: 'admin-001',
  },
  {
    id: 'inv-003',
    email: 'logistics2@food.rw',
    role: 'LOGISTICS',
    sentAt: '2026-07-01T08:00:00Z',
    expiresAt: '2026-07-08T08:00:00Z',
    status: 'EXPIRED',
    sentBy: 'admin-002',
  },
  {
    id: 'inv-004',
    email: 'trader2@food.rw',
    role: 'TRADER',
    sentAt: '2026-08-24T11:00:00Z',
    expiresAt: '2026-08-31T11:00:00Z',
    status: 'PENDING',
    sentBy: 'admin-001',
  },
  {
    id: 'inv-005',
    email: 'admin3@food.rw',
    role: 'ADMIN',
    sentAt: '2026-06-15T09:30:00Z',
    expiresAt: '2026-06-22T09:30:00Z',
    status: 'ACCEPTED',
    sentBy: 'admin-001',
  },
  {
    id: 'inv-006',
    email: 'stale.invite@food.rw',
    role: 'AGGREGATOR',
    sentAt: '2026-05-01T07:00:00Z',
    expiresAt: '2026-05-08T07:00:00Z',
    status: 'EXPIRED',
    sentBy: 'admin-002',
  },
];
