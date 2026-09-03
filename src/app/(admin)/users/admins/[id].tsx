import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { formatDate } from '@/lib/date';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_ADMINS, type AdminStatus } from '@/mocks/admins';
import { buildAdminActivity } from './_components/adminActivity';

const CAN_SUSPEND_ROLES = ['SUPERUSER'];

/**
 * Admin detail: large avatar, name/email/role/commission, Activity section (mock last login,
 * total orders managed, last 3 action log entries), Suspend/Reactivate (SUPER_ADMIN only — the
 * real role constant here is SUPERUSER, see PROGRESS.md).
 */
export default function AdminDetailScreen() {
  useRoleGuard('usersAdmins');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const baseAdmin = useMemo(() => MOCK_ADMINS.find((a) => a.id === id), [id]);
  const [statusOverride, setStatusOverride] = useState<AdminStatus | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const admin = baseAdmin && statusOverride ? { ...baseAdmin, status: statusOverride } : baseAdmin;
  const adminId = admin?.id;
  const activity = useMemo(() => (adminId ? buildAdminActivity(adminId) : null), [adminId]);

  if (!admin || !activity) {
    return (
      <AdminScreen title={t('admins.title')}>
        <EmptyState icon={null} title={t('admins.emptyTitle')} message={t('admins.emptyMessage')} />
      </AdminScreen>
    );
  }

  const isActive = admin.status === 'ACTIVE';
  const canSuspend = CAN_SUSPEND_ROLES.includes('SUPERUSER');

  return (
    <AdminScreen title={admin.name} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.headerRow}>
            <Image source={{ uri: admin.avatarUri }} style={styles.avatar} accessibilityLabel={admin.name} />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{admin.name}</Text>
              <Text style={[styles.detail, { color: colors.muted }]}>{admin.email}</Text>
              <View style={styles.badgeRow}>
                <RoleBadge role={admin.role} />
              </View>
            </View>
          </View>
          {admin.commission > 0 ? (
            <Text style={[styles.detail, { color: colors.muted }]}>
              {t('admins.commission')}: {admin.commission}%
            </Text>
          ) : null}
        </Card>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('admins.activitySection')}</Text>
          <Text style={[styles.detail, { color: colors.body }]}>
            {t('admins.lastLogin')}: {formatDate(activity.lastLoginAt, language)}
          </Text>
          <Text style={[styles.detail, { color: colors.body }]}>
            {t('admins.totalOrdersManaged')}: {activity.totalOrdersManaged}
          </Text>
          <View style={[styles.logDivider, { borderColor: colors.hairline }]} />
          {activity.entries.map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <Text style={[styles.logLabel, { color: colors.ink }]}>{entry.label}</Text>
              <Text style={[styles.logTime, { color: colors.muted }]}>{formatDate(entry.timestamp, language)}</Text>
            </View>
          ))}
        </Card>

        {canSuspend ? (
          <Button variant="destructive" fullWidth onPress={() => setConfirmOpen(true)}>
            {t(isActive ? 'admins.suspend' : 'admins.reactivate')}
          </Button>
        ) : null}

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
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xxxl, gap: space.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  textCol: { flex: 1 },
  name: { ...text.h2 },
  detail: { ...text.caption, marginTop: space.xs },
  badgeRow: { marginTop: space.sm },
  sectionTitle: { ...text.h3, marginBottom: space.sm },
  logDivider: { borderTopWidth: 1, marginVertical: space.sm },
  logRow: { paddingVertical: space.xs },
  logLabel: { ...text.body },
  logTime: { ...text.caption },
});
