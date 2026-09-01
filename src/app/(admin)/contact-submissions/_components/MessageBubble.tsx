import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import type { ConversationMessage } from '@/mocks/contact-submissions';

export interface MessageBubbleProps {
  message: ConversationMessage;
}

/** One chat bubble: original-submission (paper, left) or admin reply (leaf, white text, right), with an optional attachment thumbnail/chip. */
export function MessageBubble({ message }: MessageBubbleProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const isAdmin = message.from === 'admin';

  return (
    <View style={[styles.row, isAdmin && styles.rowRight]}>
      <View
        style={[
          styles.bubble,
          isAdmin ? { backgroundColor: colors.leaf } : { backgroundColor: colors.paper, borderColor: colors.hairline, borderWidth: 1 },
        ]}
      >
        {message.attachmentName ? (
          message.attachmentIsImage ? (
            <Image source={{ uri: message.attachmentName }} style={styles.imageAttachment} accessibilityLabel={t('contactSubmissions.attachment')} />
          ) : (
            <View style={[styles.fileChip, { borderColor: isAdmin ? colors.paper : colors.hairline }]}>
              <Ionicons name="document-outline" size={16} color={isAdmin ? colors.paper : colors.body} />
              <Text style={[styles.fileChipLabel, { color: isAdmin ? colors.paper : colors.body }]} numberOfLines={1}>
                {message.attachmentName}
              </Text>
            </View>
          )
        ) : null}
        <Text style={[text.body, { color: isAdmin ? colors.paper : colors.ink }]}>{message.text}</Text>
        <Text style={[styles.timestamp, { color: isAdmin ? colors.paper : colors.muted }]}>{formatDate(message.timestamp, language)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: space.sm },
  rowRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.md, padding: space.md, gap: space.xs },
  timestamp: { fontSize: 10, opacity: 0.8 },
  imageAttachment: { width: 120, height: 90, borderRadius: radius.sm },
  fileChip: { flexDirection: 'row', alignItems: 'center', gap: space.xs, borderWidth: 1, borderRadius: radius.sm, padding: space.xs },
  fileChipLabel: { ...text.caption, flexShrink: 1 },
});
