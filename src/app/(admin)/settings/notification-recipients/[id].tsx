import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_NOTIFICATION_RECIPIENTS } from '@/mocks/notification-recipients';
import { RecipientForm } from './_components/RecipientForm';

/** Edit notification recipient: same form as create, pre-filled. */
export default function EditNotificationRecipientScreen() {
  useRoleGuard('settings');
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useT();
  const recipient = useMemo(() => MOCK_NOTIFICATION_RECIPIENTS.find((r) => r.id === id), [id]);

  if (!recipient) {
    return (
      <AdminScreen title={t('settings.notificationRecipients')}>
        <EmptyState icon={null} title={t('settings.emptyRecipientsTitle')} message={t('settings.emptyRecipientsMessage')} />
      </AdminScreen>
    );
  }

  return (
    <AdminScreen title={t('settings.editRecipient')} showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <RecipientForm initial={recipient} onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
