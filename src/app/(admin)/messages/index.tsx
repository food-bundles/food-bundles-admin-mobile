import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { ConversationListRow } from '@/components/chat/ConversationListRow';
import { useConversationsStore } from '@/stores/conversationsStore';
import type { Conversation } from '@/mocks/chat';

/** Restaurant-relationship conversation list: one thread per restaurant, sorted by most recent activity. */
export default function MessagesScreen() {
  useRoleGuard('operations');
  const { colors } = useTheme();
  const t = useT();
  const conversations = useConversationsStore((state) => state.conversations);

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime(),
  );

  return (
    <AdminScreen title={t('messages.title')}>
      <DataList
        data={sorted}
        renderItem={({ item }: { item: Conversation }) => (
          <ConversationListRow conversation={item} onPress={() => router.push(`/(admin)/messages/${item.id}` as never)} />
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={sorted.length === 0}
        emptyTitle={t('messages.emptyTitle')}
        emptyMessage={t('messages.emptyMessage')}
        emptyIcon={<Ionicons name="chatbubbles-outline" size={20} color={colors.leaf} />}
      />
    </AdminScreen>
  );
}
