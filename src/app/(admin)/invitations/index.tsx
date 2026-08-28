import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { space, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { Button } from '@/components/ui/Button';
import { MOCK_INVITATIONS } from '@/mocks/invitations';
import { InvitationRow } from './_components/InvitationRow';

/** Invitation list: email, role badge, status, sent/expires dates. */
export default function InvitationsScreen() {
  useRoleGuard('usersAdmins');
  const { colors } = useTheme();
  const t = useT();
  const [invitations] = useState(MOCK_INVITATIONS);

  return (
    <AdminScreen title={t('invitations.title')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" size="sm" onPress={() => router.push('/(admin)/invitations/create')}>
          {t('invitations.create')}
        </Button>
      </View>
      <DataList
        data={invitations}
        renderItem={({ item }) => <InvitationRow invitation={item} />}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={invitations.length === 0}
        emptyTitle={t('invitations.emptyTitle')}
        emptyMessage={t('invitations.emptyMessage')}
        emptyIcon={<Ionicons name="mail-outline" size={20} color={colors.leaf} />}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  actionsWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, alignItems: 'flex-start' },
});
