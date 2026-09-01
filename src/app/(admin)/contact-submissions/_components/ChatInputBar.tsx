import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { ActionMenu } from '@/components/modals/ActionMenu';

export interface PendingAttachment {
  name: string;
  isImage: boolean;
}

export interface ChatInputBarProps {
  onSend: (text: string, attachment: PendingAttachment | null) => void;
}

/** Bottom input bar: multiline text (up to 4 lines), attachment button (Photo Library/Take Photo/Document via ActionMenu), send button. */
export function ChatInputBar({ onSend }: ChatInputBarProps) {
  const { colors } = useTheme();
  const t = useT();
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) setAttachment({ name: result.assets[0].uri, isImage: true });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) setAttachment({ name: result.assets[0].uri, isImage: true });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets[0]) setAttachment({ name: result.assets[0].name, isImage: false });
  };

  const handleSend = () => {
    if (!draft.trim() && !attachment) return;
    onSend(draft.trim(), attachment);
    setDraft('');
    setAttachment(null);
  };

  return (
    <View style={[styles.container, { borderColor: colors.hairline, backgroundColor: colors.paper }]}>
      {attachment ? (
        <View style={[styles.attachmentChip, { borderColor: colors.hairline }]}>
          <Text style={[styles.attachmentLabel, { color: colors.body }]} numberOfLines={1}>
            {attachment.isImage ? t('contactSubmissions.photoAttached') : attachment.name}
          </Text>
          <Pressable onPress={() => setAttachment(null)} accessibilityRole="button" accessibilityLabel={t('common.cancel')} style={styles.removeButton}>
            <Ionicons name="close" size={14} color={colors.muted} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.row}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('contactSubmissions.addAttachment')}
          style={styles.iconButton}
        >
          <Ionicons name="attach" size={22} color={colors.ink} />
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t('contactSubmissions.replyPlaceholder')}
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          style={[styles.input, { color: colors.ink, borderColor: colors.hairline }]}
          accessibilityLabel={t('contactSubmissions.replyPlaceholder')}
        />
        <Pressable
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel={t('contactSubmissions.sendReply')}
          style={[styles.sendButton, { backgroundColor: colors.leaf }]}
        >
          <Ionicons name="send" size={18} color={colors.paper} />
        </Pressable>
      </View>

      <ActionMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          { label: t('contactSubmissions.photoLibrary'), onPress: pickFromLibrary },
          { label: t('contactSubmissions.takePhoto'), onPress: takePhoto },
          { label: t('contactSubmissions.document'), onPress: pickDocument },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, padding: space.sm, minHeight: 56 },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    marginBottom: space.xs,
  },
  attachmentLabel: { ...text.caption, maxWidth: 200 },
  removeButton: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: space.xs },
  iconButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.sm, paddingVertical: space.xs, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
