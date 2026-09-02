import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { sleep } from '@/lib/chatSimulator';
import { AvatarFace } from '@/components/navigation/AvatarFace';
import { CallWaveform } from './CallWaveform';
import type { CallKind, CallState } from '@/mocks/chat';

export interface CallScreenProps {
  visible: boolean;
  kind: CallKind;
  peerName: string;
  onEnd: () => void;
}

const GRADIENT: [string, string] = ['#0E4A2B', '#14221A'];
const RINGING_MS = 2200;
const CONNECTING_MS = 1400;

const STATE_LABEL_KEY: Record<CallState, 'chat.callRinging' | 'chat.callConnecting' | 'chat.callActive' | 'chat.callEnded'> = {
  ringing: 'chat.callRinging',
  connecting: 'chat.callConnecting',
  active: 'chat.callActive',
  ended: 'chat.callEnded',
};

/** Full-screen mocked call UI: ringing -> connecting -> active, auto-progressing on a timer. No real audio/video, no WebRTC. */
export function CallScreen({ visible, kind, peerName, onEnd }: CallScreenProps) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<CallState>('ringing');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setState('ringing');
    let cancelled = false;
    (async () => {
      await sleep(RINGING_MS);
      if (cancelled) return;
      setState('connecting');
      await sleep(CONNECTING_MS);
      if (cancelled) return;
      setState('active');
    })();
    return () => {
      cancelled = true;
    };
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onEnd}>
      <LinearGradient colors={GRADIENT} style={[styles.root, { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.xl }]}>
        <View style={styles.header}>
          <Text style={styles.kindLabel}>{kind === 'video' ? t('chat.startVideoCall') : t('chat.startAudioCall')}</Text>
        </View>

        <View style={styles.centre}>
          <View style={styles.avatarRing}>
            <AvatarFace size={72} />
          </View>
          <Text style={styles.peerName}>{peerName}</Text>
          <Text style={styles.stateLabel}>{t(STATE_LABEL_KEY[state])}</Text>
          {state === 'active' ? <CallWaveform /> : null}
        </View>

        <View style={styles.controls}>
          <CallControlButton
            active={muted}
            icon={muted ? 'mic-off' : 'mic'}
            label={muted ? t('chat.unmute') : t('chat.mute')}
            onPress={() => setMuted((v) => !v)}
          />
          <Pressable onPress={onEnd} accessibilityRole="button" accessibilityLabel={t('chat.endCall')} style={styles.endButton}>
            <Ionicons name="call" size={28} color="#FFFFFF" style={styles.endIcon} />
          </Pressable>
          <CallControlButton
            active={speaker}
            icon={speaker ? 'volume-high' : 'volume-medium-outline'}
            label={t('chat.speaker')}
            onPress={() => setSpeaker((v) => !v)}
          />
        </View>
      </LinearGradient>
    </Modal>
  );
}

function CallControlButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.controlButton, active && styles.controlButtonActive]}
    >
      <Ionicons name={icon} size={24} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', paddingHorizontal: space.xl },
  header: { alignItems: 'center' },
  kindLabel: { ...text.caption, color: 'rgba(255,255,255,0.7)' },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.sm },
  avatarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  peerName: { ...text.h1, color: '#FFFFFF' },
  stateLabel: { ...text.body, color: 'rgba(255,255,255,0.75)', marginBottom: space.lg },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xxl, width: '100%' },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: hit.min,
    minHeight: hit.min,
  },
  controlButtonActive: { backgroundColor: '#FFFFFF33' },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: '#D64545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endIcon: { transform: [{ rotate: '135deg' }] },
});
