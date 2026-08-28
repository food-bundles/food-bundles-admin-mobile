import { useState } from 'react';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { NewsletterTabs, type NewsletterTabKey } from './_components/NewsletterTabs';
import { SubscribersTab } from './_components/SubscribersTab';
import { CampaignsTab } from './_components/CampaignsTab';

/** Newsletter: Subscribers | Campaigns tabs. No dedicated screen-specs entry — built from the mock-data shapes and drawer placement. */
export default function NewsletterScreen() {
  useRoleGuard('operations');
  const t = useT();
  const [tab, setTab] = useState<NewsletterTabKey>('subscribers');

  return (
    <AdminScreen title={t('newsletter.title')}>
      <NewsletterTabs active={tab} onChange={setTab} />
      {tab === 'subscribers' ? <SubscribersTab /> : <CampaignsTab />}
    </AdminScreen>
  );
}
