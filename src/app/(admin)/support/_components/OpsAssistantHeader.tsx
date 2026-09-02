import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { AvatarFace } from '@/components/navigation/AvatarFace';

const GRADIENT_LEAF: [string, string] = ['#17683F', '#0E4A2B'];

/** Chat-screen header strip: animated AvatarFace avatar, assistant name, "always available" subtitle. */
export function OpsAssistantHeader() {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={[styles.row, { borderColor: colors.hairline }]}>
      <LinearGradient colors={GRADIENT_LEAF} style={styles.avatar}>
        <AvatarFace size={26} />
      </LinearGradient>
      <View>
        <Text style={[text.bodySemi, { color: colors.ink }]}>{t('opsAssistant.name')}</Text>
        <Text style={[text.caption, { color: colors.muted }]}>{t('opsAssistant.subtitle')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.sm, borderBottomWidth: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
