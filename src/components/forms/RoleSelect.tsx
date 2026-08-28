import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import type { AdminRole } from '@/types/auth';

const ROLE_KEY: Record<AdminRole, TranslationKey> = {
  SUPERUSER: 'role.superuser',
  ADMIN: 'role.admin',
  AGGREGATOR: 'role.aggregator',
  LOGISTICS: 'role.logistics',
  TRADER: 'role.trader',
};

/** Which roles the signed-in admin is allowed to assign. Only SUPERUSER may assign SUPERUSER. */
const ASSIGNABLE_BY: Record<AdminRole, AdminRole[]> = {
  SUPERUSER: ['SUPERUSER', 'ADMIN', 'AGGREGATOR', 'LOGISTICS', 'TRADER'],
  ADMIN: ['ADMIN', 'AGGREGATOR', 'LOGISTICS', 'TRADER'],
  AGGREGATOR: [],
  LOGISTICS: [],
  TRADER: [],
};

export interface RoleSelectProps {
  value: AdminRole;
  onChange: (role: AdminRole) => void;
  assignerRole: AdminRole;
}

/** Segmented control for the real 5-role model, filtered to what assignerRole may grant. */
export function RoleSelect({ value, onChange, assignerRole }: RoleSelectProps) {
  const { colors } = useTheme();
  const t = useT();
  const options = ASSIGNABLE_BY[assignerRole];

  return (
    <View style={styles.row}>
      {options.map((role) => {
        const active = role === value;
        return (
          <Pressable
            key={role}
            onPress={() => onChange(role)}
            accessibilityRole="button"
            accessibilityLabel={t(ROLE_KEY[role])}
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              active
                ? { backgroundColor: colors.leaf }
                : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.hairline },
            ]}
          >
            <Text style={[styles.label, { color: active ? colors.paper : colors.body }]}>{t(ROLE_KEY[role])}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});
