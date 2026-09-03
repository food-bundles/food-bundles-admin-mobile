import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { shadow } from '@/theme';
import { useT } from '@/i18n';
import { AvatarFace } from './AvatarFace';

const SIZE = 56;
const GRADIENT_LEAF: [string, string] = ['#17683F', '#0E4A2B'];

/**
 * Raised centre slot of the bottom nav bar: an animated AI-assistant avatar, not a normal tab
 * item. Elevated above the tab bar baseline via a negative marginTop. Navigates to the AI support
 * chat screen — no existing support/chat route was found under (admin)/, so a minimal placeholder
 * chat screen was built at (admin)/support/chat.tsx for this to target.
 */
export function AvatarTabButton() {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push('/(admin)/support/chat' as never)}
      accessibilityRole="button"
      accessibilityLabel={t('tab.aiSupport')}
      hitSlop={8}
      style={styles.wrap}
    >
      <LinearGradient colors={GRADIENT_LEAF} style={styles.circle}>
        <AvatarFace size={30} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.elevated,
  },
});
