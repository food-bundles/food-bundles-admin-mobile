import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { RecipientForm } from './_components/RecipientForm';

/** Create notification recipient: same form as edit. */
export default function CreateNotificationRecipientScreen() {
  const t = useT();

  return (
    <AdminScreen title={t('settings.addRecipient')}>
      <ScrollView contentContainerStyle={styles.content}>
        <RecipientForm onSubmit={() => router.back()} submitLabel={t('common.save')} />
      </ScrollView>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
});
