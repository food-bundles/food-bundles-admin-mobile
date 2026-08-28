import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { InAppBanner } from './InAppBanner';

const RECENCY_WINDOW_MS = 60_000;

/**
 * Mounts at the root and surfaces an InAppBanner for the most recent unread
 * notification if it arrived within the last minute — the closest honest
 * proxy for "a push just came in" available without a real push backend.
 */
export function InAppBannerHost() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const markRead = useNotificationsStore((state) => state.markRead);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const candidate = notifications.find(
    (n) => !n.read && n.id !== dismissedId && Date.now() - new Date(n.timestamp).getTime() < RECENCY_WINDOW_MS,
  );

  useEffect(() => {
    if (!candidate) return;
    const timer = setTimeout(() => setDismissedId(candidate.id), 4000);
    return () => clearTimeout(timer);
  }, [candidate]);

  if (!candidate) return null;

  return (
    <InAppBanner
      title={candidate.title}
      body={candidate.body}
      onPress={() => {
        markRead(candidate.id);
        setDismissedId(candidate.id);
        router.push(candidate.deepLink as never);
      }}
      onDismiss={() => setDismissedId(candidate.id)}
    />
  );
}
