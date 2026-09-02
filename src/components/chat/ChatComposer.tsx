import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { RecordingPresets, requestRecordingPermissionsAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { ActionMenu } from '@/components/modals/ActionMenu';
import type { ChatMessageKind } from '@/mocks/chat';

export interface ComposerAttachment {
  kind: Extract<ChatMessageKind, 'image' | 'file' | 'voice'>;
  uri: string;
  label: string;
  durationMs?: number;
}

export interface ChatComposerProps {
  onSend: (text: string, attachment: ComposerAttachment | null) => void;
}

/** Shared bottom input bar: text, photo/camera/document attach, and real on-device voice-note recording via expo-audio. */
export function ChatComposer({ onSend }: ChatComposerProps) {
  const { colors } = useTheme();
  const t = useT();
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<ComposerAttachment | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) setAttachment({ kind: 'image', uri: result.assets[0].uri, label: t('chat.imageAttachment') });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) setAttachment({ kind: 'image', uri: result.assets[0].uri, label: t('chat.imageAttachment') });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets[0]) setAttachment({ kind: 'file', uri: result.assets[0].uri, label: result.assets[0].name });
  };

  const startRecording = async () => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) return;
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    if (recorder.uri) {
      setAttachment({ kind: 'voice', uri: recorder.uri, label: t('chat.recordVoiceNote'), durationMs: recorderState.durationMillis });
    }
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
            {attachment.label}
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
          accessibilityLabel={t('chat.attach')}
          style={styles.iconButton}
        >
          <Ionicons name="attach" size={22} color={colors.ink} />
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t('chat.messagePlaceholder')}
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          style={[styles.input, { color: colors.ink, borderColor: colors.hairline }]}
          accessibilityLabel={t('chat.messagePlaceholder')}
        />
        <Pressable
          onPress={recorderState.isRecording ? stopRecording : startRecording}
          accessibilityRole="button"
          accessibilityLabel={recorderState.isRecording ? t('chat.stopRecording') : t('chat.recordVoiceNote')}
          style={[styles.iconButton, recorderState.isRecording && { backgroundColor: colors.tintChili, borderRadius: radius.pill }]}
        >
          <Ionicons name={recorderState.isRecording ? 'stop-circle' : 'mic-outline'} size={22} color={recorderState.isRecording ? colors.chili : colors.ink} />
        </Pressable>
        <Pressable
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel={t('chat.sendMessage')}
          style={[styles.sendButton, { backgroundColor: colors.leaf }]}
        >
          <Ionicons name="send" size={18} color={colors.paper} />
        </Pressable>
      </View>

      <ActionMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[
          { label: t('chat.photoLibrary'), onPress: pickFromLibrary },
          { label: t('chat.takePhoto'), onPress: takePhoto },
          { label: t('chat.document'), onPress: pickDocument },
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
