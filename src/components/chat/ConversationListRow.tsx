import { Image, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRelative } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import type { Conversation } from '@/mocks/chat';

export interface ConversationListRowProps {
  conversation: Conversation;
  onPress: () => void;
}

/** One row in the restaurant conversation list: avatar, name, last-message preview, timestamp, unread badge. */
export function ConversationListRow({ conversation, onPress }: ConversationListRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const previewKindLabel: Record<string, string> = {
    voice: t('chat.recordVoiceNote'),
    file: t('chat.fileAttachment'),
    image: t('chat.imageAttachment'),
  };
  const preview = previewKindLabel[conversation.lastMessage.kind] ?? conversation.lastMessage.body;

  return (
    <Card onPress={onPress} accessibilityLabel={`${conversation.restaurantName}, ${preview}`}>
      <View style={styles.row}>
        <Image source={{ uri: conversation.restaurantImageUri }} style={styles.avatar} />
        <View style={styles.textCol}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
              {conversation.restaurantName}
            </Text>
            <Text style={[styles.time, { color: colors.muted }]}>{formatRelative(conversation.lastMessage.sentAt, language, t)}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={[styles.preview, { color: colors.muted }]} numberOfLines={1}>
              {preview}
            </Text>
            {conversation.unreadCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.leaf }]}>
                <Text style={styles.badgeText}>{conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 48, height: 48, borderRadius: radius.pill },
  textCol: { flex: 1, gap: 2 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.bodySemi, flexShrink: 1 },
  time: { ...text.caption },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  preview: { ...text.caption, flex: 1 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});
