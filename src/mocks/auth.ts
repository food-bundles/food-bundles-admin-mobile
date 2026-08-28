import type { AdminUser } from '@/types/auth';

/** The signed-in mock admin. Role fixed to SUPERUSER per the owner's binding decision. */
export const MOCK_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Patrick Nzeyimana',
  email: 'patrick@food.rw',
  role: 'SUPERUSER',
  avatarUri: 'https://i.pravatar.cc/150?img=12',
  twoFactorEnabled: true,
  createdAt: '2025-01-15T08:00:00Z',
};
