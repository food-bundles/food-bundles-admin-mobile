import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatTime } from '@/lib/date';
import { VoiceNoteBubble } from './VoiceNoteBubble';
import type { ChatMessage } from '@/mocks/chat';

export interface MessageBubbleProps {
  message: ChatMessage;
  /** True when this bubble was sent by the current viewer (renders right-aligned, leaf-filled). */
  isOwn: boolean;
}

/**
 * Generalized chat bubble shared by every chat surface in the app (AI ops-assistant, restaurant
 * peer chat, contact-submissions support inbox): text/voice/file/image content, a timestamp, and
 * read-state ticks for the viewer's own messages.
 */
export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  const bubbleStyle = isOwn
    ? { backgroundColor: colors.leaf }
    : { backgroundColor: colors.paper, borderColor: colors.hairline, borderWidth: 1 };
  const textColor = isOwn ? colors.paper : colors.ink;
  const timeColor = isOwn ? 'rgba(255,255,255,0.75)' : colors.muted;

  return (
    <View style={[styles.row, isOwn && styles.rowRight]}>
      <View style={[styles.bubble, bubbleStyle]}>
        {message.kind === 'image' && message.attachment ? (
          <Image source={{ uri: message.attachment }} style={styles.imageAttachment} accessibilityLabel={t('chat.imageAttachment')} />
        ) : null}
        {message.kind === 'file' && message.attachment ? (
          <View style={[styles.fileChip, { borderColor: isOwn ? colors.paper : colors.hairline }]}>
            <Ionicons name="document-outline" size={16} color={textColor} />
            <Text style={[styles.fileChipLabel, { color: textColor }]} numberOfLines={1}>
              {message.attachment}
            </Text>
          </View>
        ) : null}
        {message.kind === 'voice' && message.attachment ? (
          <VoiceNoteBubble uri={message.attachment} durationMs={message.durationMs ?? 0} tint={isOwn ? 'onLeaf' : 'onPaper'} />
        ) : null}
        {message.kind === 'text' && message.body ? <Text style={[text.body, { color: textColor }]}>{message.body}</Text> : null}

        <View style={styles.metaRow}>
          <Text style={[styles.timestamp, { color: timeColor }]}>{formatTime(message.sentAt, language)}</Text>
          {isOwn ? (
            <Ionicons
              name={message.readAt ? 'checkmark-done' : message.deliveredAt ? 'checkmark-done' : 'checkmark'}
              size={13}
              color={message.readAt ? colors.onPineBright : timeColor}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: space.sm },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.md, padding: space.md, gap: space.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  timestamp: { fontSize: 10 },
  imageAttachment: { width: 160, height: 120, borderRadius: radius.sm },
  fileChip: { flexDirection: 'row', alignItems: 'center', gap: space.xs, borderWidth: 1, borderRadius: radius.sm, padding: space.xs },
  fileChipLabel: { ...text.caption, flexShrink: 1 },
});
