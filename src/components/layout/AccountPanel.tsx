import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme, useThemeStore, type ThemeOverride } from '@/theme';
import { useT, useLanguageStore, type Language } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import { Sheet } from '@/components/modals/Sheet';
import { RoleBadge } from '@/components/ui/RoleBadge';

export interface AccountPanelProps {
  visible: boolean;
  onClose: () => void;
}

const THEME_OPTIONS: { key: ThemeOverride; labelKey: 'account.themeLight' | 'account.themeDark' | 'account.themeSystem' }[] = [
  { key: 'light', labelKey: 'account.themeLight' },
  { key: 'dark', labelKey: 'account.themeDark' },
  { key: 'system', labelKey: 'account.themeSystem' },
];

const LANGUAGE_OPTIONS: { key: Language; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'rw', label: 'Kinyarwanda' },
  { key: 'fr', label: 'FR' },
];

/** Header avatar's account sheet: profile summary, theme + language toggles, sign out. */
export function AccountPanel({ visible, onClose }: AccountPanelProps) {
  const { colors } = useTheme();
  const t = useT();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const override = useThemeStore((state) => state.override);
  const setOverride = useThemeStore((state) => state.setOverride);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [passwordSent, setPasswordSent] = useState(false);

  if (!user) return null;

  const goTo = (path: string) => {
    onClose();
    router.push(path as never);
  };

  return (
    <Sheet visible={visible} height="tall" onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: user.avatarUri }} style={styles.avatar} accessibilityLabel={user.name} />
          <Text style={[styles.name, { color: colors.ink }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.muted }]}>{user.email}</Text>
          <RoleBadge role={user.role} />
        </View>

        <PanelRow icon="person-outline" label={t('account.myProfile')} onPress={() => goTo('/(admin)/account/profile')} />
        <PanelRow
          icon="key-outline"
          label={t('account.changePassword')}
          onPress={() => setPasswordSent(true)}
        />
        {passwordSent ? (
          <Text style={[styles.confirmText, { color: colors.ripe }]}>{t('account.changePasswordSent')}</Text>
        ) : null}

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t('account.theme')}</Text>
        <View style={styles.chipRow}>
          {THEME_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setOverride(opt.key)}
              accessibilityRole="button"
              accessibilityLabel={t(opt.labelKey)}
              accessibilityState={{ selected: override === opt.key }}
              style={[
                styles.chip,
                { borderColor: colors.hairline },
                override === opt.key && { backgroundColor: colors.leaf, borderColor: colors.leaf },
              ]}
            >
              <Text style={[styles.chipLabel, { color: override === opt.key ? colors.paper : colors.body }]}>{t(opt.labelKey)}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>{t('account.language')}</Text>
        <View style={styles.chipRow}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setLanguage(opt.key)}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected: language === opt.key }}
              style={[
                styles.chip,
                { borderColor: colors.hairline },
                language === opt.key && { backgroundColor: colors.leaf, borderColor: colors.leaf },
              ]}
            >
              <Text style={[styles.chipLabel, { color: language === opt.key ? colors.paper : colors.body }]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.hairline }]} />

        <PanelRow
          icon="log-out-outline"
          label={t('account.signOut')}
          destructive
          onPress={() => {
            signOut();
            onClose();
            router.replace('/(auth)/login');
          }}
        />
      </ScrollView>
    </Sheet>
  );
}

function PanelRow({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.row}>
      <Ionicons name={icon} size={20} color={destructive ? colors.chili : colors.ink} />
      <Text style={[styles.rowLabel, { color: destructive ? colors.chili : colors.ink }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: space.xs, marginBottom: space.lg },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: space.sm },
  name: { ...text.h2 },
  email: { ...text.body },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: hit.min },
  rowLabel: { ...text.bodySemi, flex: 1 },
  confirmText: { ...text.caption, marginBottom: space.sm },
  sectionLabel: { ...text.overline, marginTop: space.md, marginBottom: space.xs },
  chipRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  chip: { minHeight: hit.min - 8, paddingHorizontal: space.md, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipLabel: { ...text.bodySemi },
  divider: { height: 1, marginVertical: space.lg },
});
