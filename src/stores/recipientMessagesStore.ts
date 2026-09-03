import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_NOTIFICATIONS, type AdminNotification, type NotificationChannel } from '@/mocks/notifications';

export interface RecipientMessage {
  id: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  timestamp: string;
}

interface RecipientMessagesState {
  /** Extra test messages sent from the recipient detail screen, keyed by recipient id. */
  sentByRecipient: Record<string, RecipientMessage[]>;
  sendTestMessage: (recipientId: string, channel: NotificationChannel, body: string) => void;
}

export const useRecipientMessagesStore = create<RecipientMessagesState>((set) => ({
  sentByRecipient: {},
  sendTestMessage: (recipientId, channel, body) =>
    set((state) => {
      const message: RecipientMessage = {
        id: generateId('msg'),
        title: 'Test notification',
        body,
        channel,
        timestamp: new Date().toISOString(),
      };
      return {
        sentByRecipient: {
          ...state.sentByRecipient,
          [recipientId]: [message, ...(state.sentByRecipient[recipientId] ?? [])],
        },
      };
    }),
}));

/**
 * The mock AdminNotification model has no per-recipient identity (it's the signed-in admin's own
 * inbox, filtered by channel) — there is no real "sent to this external recipient" log anywhere in
 * this codebase's mock data. Honest approximation: the last 5 notifications whose channel matches
 * one this recipient is subscribed to, newest first, stand in for "message history for this
 * recipient" until a real per-recipient delivery log exists.
 */
export function historyFor(channels: NotificationChannel[], extra: RecipientMessage[]): RecipientMessage[] {
  const fromLog: RecipientMessage[] = MOCK_NOTIFICATIONS.filter((n: AdminNotification) => channels.includes(n.channel))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map((n) => ({ id: n.id, title: n.title, body: n.body, channel: n.channel, timestamp: n.timestamp }));
  return [...extra, ...fromLog].slice(0, 8);
}
