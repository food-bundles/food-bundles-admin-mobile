import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { useAuthStore } from '@/stores/authStore';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MOCK_ADMINS } from '@/mocks/admins';
import type { AdminRole } from '@/types/auth';
import { AdminRow } from './_components/AdminRow';
import { InviteAdminSheet } from './_components/InviteAdminSheet';

interface PendingInvite {
  email: string;
  role: AdminRole;
}

/** Admin list, SUPERUSER only. Invite sends a mock invitation, shown as a pending-invites section. */
export default function AdminsScreen() {
  useRoleGuard('usersAdmins');
  const { colors } = useTheme();
  const t = useT();
  const role = useAuthStore((state) => state.user?.role);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  return (
    <AdminScreen title={t('admins.title')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" onPress={() => setSheetOpen(true)}>
          {t('admins.invite')}
        </Button>
      </View>
      {pendingInvites.length > 0 ? (
        <View style={styles.pendingWrap}>
          <Card>
            {pendingInvites.map((invite, index) => (
              <View
                key={invite.email}
                style={[styles.pendingRow, index < pendingInvites.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
              >
                <Text style={[styles.pendingEmail, { color: colors.ink }]}>{invite.email}</Text>
                <Badge tone="marigold" label={invite.role} />
              </View>
            ))}
          </Card>
        </View>
      ) : null}
      <DataList
        data={MOCK_ADMINS}
        renderItem={({ item }) => <AdminRow admin={item} />}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={MOCK_ADMINS.length === 0}
        emptyTitle={t('admins.emptyTitle')}
        emptyMessage={t('admins.emptyMessage')}
        emptyIcon={<Ionicons name="shield-outline" size={20} color={colors.leaf} />}
      />
      <InviteAdminSheet
        visible={sheetOpen}
        assignerRole={role ?? 'ADMIN'}
        onClose={() => setSheetOpen(false)}
        onInvite={(email, invitedRole) => setPendingInvites((prev) => [...prev, { email, role: invitedRole }])}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  actionsWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, alignItems: 'flex-start' },
  pendingWrap: { paddingHorizontal: space.lg, paddingBottom: space.md },
  pendingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  pendingEmail: { ...text.body },
});
