import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface VoiceNoteBubbleProps {
  uri: string;
  durationMs: number;
  tint: 'onLeaf' | 'onPaper';
}

const BAR_COUNT = 18;

/** Deterministic pseudo-waveform bar heights derived from the note's own URI so every render is stable. */
function waveformHeights(seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: BAR_COUNT }, (_, i) => 4 + ((hash >> (i % 24)) % 14));
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Voice-note bubble: waveform, play/pause, duration. Real on-device playback via expo-audio. */
export function VoiceNoteBubble({ uri, durationMs, tint }: VoiceNoteBubbleProps) {
  const { colors } = useTheme();
  const t = useT();
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const [heights] = useState(() => waveformHeights(uri));
  const isPlaying = status.playing;

  useEffect(() => {
    if (status.didJustFinish) player.seekTo(0);
  }, [status.didJustFinish, player]);

  const toggle = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const fg = tint === 'onLeaf' ? colors.paper : colors.leaf;
  const barColor = tint === 'onLeaf' ? 'rgba(255,255,255,0.6)' : colors.disabledLine;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? t('chat.pauseVoiceNote') : t('chat.playVoiceNote')}
        style={[styles.playButton, { backgroundColor: tint === 'onLeaf' ? 'rgba(255,255,255,0.2)' : colors.tintLeaf }]}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={fg} />
      </Pressable>
      <View style={styles.waveform}>
        {heights.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h, backgroundColor: barColor }]} />
        ))}
      </View>
      <Text style={[styles.duration, { color: fg }]}>{formatDuration(durationMs)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minWidth: 180 },
  playButton: { width: hit.min, height: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 24 },
  bar: { width: 3, borderRadius: 2 },
  duration: { ...text.caption },
});
