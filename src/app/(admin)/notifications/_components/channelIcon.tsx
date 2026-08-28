import { Ionicons } from '@expo/vector-icons';
import type { NotificationChannel } from '@/mocks/notifications';

const ICON: Record<NotificationChannel, keyof typeof Ionicons.glyphMap> = {
  orders: 'receipt-outline',
  vouchers: 'ticket-outline',
  submissions: 'leaf-outline',
  stock: 'cube-outline',
  system: 'server-outline',
  users: 'people-outline',
};

/** Renders the icon representing a notification's channel. */
export function renderChannelIcon(channel: NotificationChannel, color: string, size = 20) {
  return <Ionicons name={ICON[channel]} size={size} color={color} />;
}
