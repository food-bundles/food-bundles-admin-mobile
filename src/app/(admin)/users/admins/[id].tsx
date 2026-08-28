import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_ADMINS, type AdminStatus } from '@/mocks/admins';

/** Admin detail: name, email, role, commission, status, suspend/reactivate. SUPERUSER only. */
export default function AdminDetailScreen() {
  useRoleGuard('usersAdmins');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const baseAdmin = useMemo(() => MOCK_ADMINS.find((a) => a.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<AdminStatus | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const admin = baseAdmin && statusOverride ? { ...baseAdmin, status: statusOverride } : baseAdmin;

  if (!admin) {
    return (
      <AdminScreen title={t('admins.title')}>
        <EmptyState icon={null} title={t('admins.emptyTitle')} message={t('admins.emptyMessage')} />
      </AdminScreen>
    );
  }

  const isActive = admin.status === 'ACTIVE';

  return (
    <AdminScreen title={admin.name}>
      <View style={styles.content}>
        <Card>
          <Text style={[styles.name, { color: colors.ink }]}>{admin.name}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>{admin.email}</Text>
          <View style={styles.badgeRow}>
            <RoleBadge role={admin.role} />
          </View>
          {admin.commission > 0 ? (
            <Text style={[styles.detail, { color: colors.muted }]}>
              {t('admins.commission')}: {admin.commission}%
            </Text>
          ) : null}
        </Card>

        <Button variant="destructive" fullWidth onPress={() => setConfirmOpen(true)}>
          {t(isActive ? 'admins.suspend' : 'admins.reactivate')}
        </Button>

        <ConfirmDialog
          visible={confirmOpen}
          title={t(isActive ? 'admins.suspend' : 'admins.reactivate')}
          message={admin.name}
          confirmLabel={t('common.confirm')}
          variant={isActive ? 'danger' : 'warning'}
          onConfirm={() => {
            setStatusOverride(isActive ? 'SUSPENDED' : 'ACTIVE');
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </View>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingTop: space.md, gap: space.md },
  name: { ...text.h2 },
  detail: { ...text.caption, marginTop: space.xs },
  badgeRow: { marginTop: space.sm },
});
