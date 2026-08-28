/** Real 5-role admin model, confirmed via create-admin-modal.tsx on the web dashboard. */
export type AdminRole = 'SUPERUSER' | 'ADMIN' | 'AGGREGATOR' | 'LOGISTICS' | 'TRADER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUri: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}
