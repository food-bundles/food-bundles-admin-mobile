import { create } from 'zustand';
import { MOCK_NOTIFICATIONS, type AdminNotification } from '@/mocks/notifications';

interface NotificationsState {
  notifications: AdminNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
}

/** Session-only notification state, seeded from the mock list. No persistence, no fetch. */
export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  markRead: (id) =>
    set((state) => ({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),
  deleteNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
}));

export function useUnreadCount(): number {
  return useNotificationsStore((state) => state.notifications.filter((n) => !n.read).length);
}
