import { StyleSheet, Text, View } from 'react-native';
import { radius, ROLE_BADGE_TOKEN, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { AdminRole } from '@/types/auth';

const ROLE_KEY: Record<AdminRole, TranslationKey> = {
  SUPERUSER: 'role.superuser',
  ADMIN: 'role.admin',
  AGGREGATOR: 'role.aggregator',
  LOGISTICS: 'role.logistics',
  TRADER: 'role.trader',
} as const;

export interface RoleBadgeProps {
  role: AdminRole;
}

/** Admin-role pill, coloured per the exact ROLE_BADGE_TOKEN mapping. */
export function RoleBadge({ role }: RoleBadgeProps) {
  const { colors } = useTheme();
  const t = useT();
  const token = ROLE_BADGE_TOKEN[role];

  return (
    <View style={[styles.base, { backgroundColor: colors[token.bg] }]}>
      <Text style={[styles.label, { color: colors[token.text] }]}>{t(ROLE_KEY[role])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
    alignSelf: 'flex-start',
  },
  label: { ...text.overline },
});
