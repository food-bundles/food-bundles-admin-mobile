import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface ConversationHeaderProps {
  restaurantName: string;
  restaurantImageUri: string;
  onAudioCall: () => void;
  onVideoCall: () => void;
}

/** Thread header strip: restaurant avatar/name plus audio/video call launch buttons. */
export function ConversationHeader({ restaurantName, restaurantImageUri, onAudioCall, onVideoCall }: ConversationHeaderProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={[styles.row, { borderColor: colors.hairline }]}>
      <View style={styles.identity}>
        <Image source={{ uri: restaurantImageUri }} style={styles.avatar} />
        <Text style={[text.bodySemi, { color: colors.ink }]} numberOfLines={1}>
          {restaurantName}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onAudioCall} accessibilityRole="button" accessibilityLabel={t('chat.startAudioCall')} style={styles.iconButton}>
          <Ionicons name="call-outline" size={20} color={colors.leaf} />
        </Pressable>
        <Pressable onPress={onVideoCall} accessibilityRole="button" accessibilityLabel={t('chat.startVideoCall')} style={styles.iconButton}>
          <Ionicons name="videocam-outline" size={20} color={colors.leaf} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: space.sm, borderBottomWidth: 1 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  avatar: { width: 36, height: 36, borderRadius: radius.pill },
  actions: { flexDirection: 'row', gap: space.xs },
  iconButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
});
