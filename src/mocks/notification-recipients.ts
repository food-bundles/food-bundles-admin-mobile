import type { NotificationChannel } from './notifications';

export interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  channels: NotificationChannel[];
  active: boolean;
}

/** 5 notification recipients across a mix of channel subscriptions. */
export const MOCK_NOTIFICATION_RECIPIENTS: NotificationRecipient[] = [
  { id: 'recip-001', name: 'Patrick Nzeyimana', email: 'patrick@food.rw', channels: ['orders', 'system'], active: true },
  { id: 'recip-002', name: 'Chantal Umuhoza', email: 'chantal@food.rw', channels: ['vouchers', 'submissions'], active: true },
  { id: 'recip-003', name: 'Didier Kabera', email: 'didier@food.rw', channels: ['stock'], active: true },
  { id: 'recip-004', name: 'Solange Mutesi', email: 'solange@food.rw', channels: ['orders'], active: false },
  { id: 'recip-005', name: 'Aline Nyirahabimana', email: 'aline@food.rw', channels: ['vouchers', 'users'], active: true },
];
