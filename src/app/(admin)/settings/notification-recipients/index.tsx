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
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { MOCK_NOTIFICATION_RECIPIENTS, type NotificationRecipient } from '@/mocks/notification-recipients';
import { RecipientRow } from './_components/RecipientRow';

/** Notification recipient list: name, email, channel chips, status. Built from settings/notification-recipient/page.tsx. */
export default function NotificationRecipientsScreen() {
  useRoleGuard('settings');
  const { colors } = useTheme();
  const t = useT();
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<NotificationRecipient | null>(null);

  const recipients = MOCK_NOTIFICATION_RECIPIENTS.filter((r) => !removedIds.includes(r.id));

  return (
    <AdminScreen title={t('settings.notificationRecipients')}>
      <View style={styles.actionsWrap}>
        <Button variant="primary" size="sm" onPress={() => router.push('/(admin)/settings/notification-recipients/create')}>
          {t('settings.addRecipient')}
        </Button>
      </View>
      <DataList
        data={recipients}
        renderItem={({ item }) => (
          <RecipientRow
            recipient={item}
            onEdit={() => router.push(`/(admin)/settings/notification-recipients/${item.id}` as never)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={recipients.length === 0}
        emptyTitle={t('settings.emptyRecipientsTitle')}
        emptyMessage={t('settings.emptyRecipientsMessage')}
        emptyIcon={<Ionicons name="notifications-outline" size={20} color={colors.leaf} />}
      />
      <ConfirmDialog
        visible={deleteTarget !== null}
        title={t('common.delete')}
        message={deleteTarget ? t('settings.deleteRecipientConfirm', { name: deleteTarget.name }) : ''}
        confirmLabel={t('common.delete')}
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) setRemovedIds((prev) => [...prev, deleteTarget.id]);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  actionsWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md, alignItems: 'flex-start' },
});
