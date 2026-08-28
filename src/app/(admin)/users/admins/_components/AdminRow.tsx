import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { RoleBadge } from '@/components/ui/RoleBadge';
import type { AdminRecord } from '@/mocks/admins';

export interface AdminRowProps {
  admin: AdminRecord;
}

/** Name + email + role badge + commission (if any) + status. */
export function AdminRow({ admin }: AdminRowProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Card accessibilityLabel={admin.name}>
      <View style={styles.header}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{admin.name}</Text>
          <Text style={[styles.email, { color: colors.muted }]}>{admin.email}</Text>
        </View>
        <RoleBadge role={admin.role} />
      </View>
      {admin.commission > 0 ? (
        <Text style={[styles.commission, { color: colors.muted }]}>
          {t('admins.commission')}: {admin.commission}%
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  email: { ...text.caption, marginTop: 2 },
  commission: { ...text.caption, marginTop: space.xs },
});
