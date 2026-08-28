import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { DataList } from '@/components/data/DataList';
import { MOCK_CONTACT_SUBMISSIONS } from '@/mocks/contact-submissions';
import { ContactRow } from './_components/ContactRow';

/** Contact submissions list: name + email + date + status, marigold left border on unread. */
export default function ContactSubmissionsScreen() {
  useRoleGuard('operations');
  const { colors } = useTheme();
  const t = useT();
  const [submissions] = useState(MOCK_CONTACT_SUBMISSIONS);

  return (
    <AdminScreen title={t('contactSubmissions.title')}>
      <DataList
        data={submissions}
        renderItem={({ item }) => <ContactRow submission={item} />}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={submissions.length === 0}
        emptyTitle={t('contactSubmissions.emptyTitle')}
        emptyMessage={t('contactSubmissions.emptyMessage')}
        emptyIcon={<Ionicons name="chatbox-outline" size={20} color={colors.leaf} />}
      />
    </AdminScreen>
  );
}
