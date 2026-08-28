export type CampaignStatus = 'DRAFT' | 'SENT' | 'FAILED';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface Campaign {
  id: string;
  subject: string;
  body: string;
  sentAt: string | null;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  status: CampaignStatus;
}

/** 25 newsletter subscribers. */
export const MOCK_SUBSCRIBERS: NewsletterSubscriber[] = Array.from({ length: 25 }, (_, i) => ({
  id: `sub-${String(i + 1).padStart(3, '0')}`,
  email: `subscriber${i + 1}@example.rw`,
  subscribedAt: new Date(2026, 0, 1 + i * 6).toISOString(),
}));

/** 4 campaigns: mix of DRAFT, SENT, FAILED. */
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    subject: 'New markets are live in Kimironko and Nyabugogo',
    body: 'We have expanded price tracking to two more markets this month.',
    sentAt: '2026-07-01T08:00:00Z',
    recipientCount: 22,
    openRate: 0.64,
    clickRate: 0.18,
    status: 'SENT',
  },
  {
    id: 'camp-002',
    subject: 'Premium subscribers now get priority delivery',
    body: 'Starting this month, Premium plan restaurants get priority delivery windows.',
    sentAt: '2026-08-01T08:00:00Z',
    recipientCount: 24,
    openRate: 0.71,
    clickRate: 0.25,
    status: 'SENT',
  },
  {
    id: 'camp-003',
    subject: 'August price trends across all markets',
    body: 'A look back at how vegetable prices moved across our 5 tracked markets.',
    sentAt: null,
    recipientCount: 0,
    openRate: 0,
    clickRate: 0,
    status: 'DRAFT',
  },
  {
    id: 'camp-004',
    subject: 'Voucher and loan program update',
    body: 'New discount tiers are now available for qualifying restaurants.',
    sentAt: '2026-08-15T09:00:00Z',
    recipientCount: 25,
    openRate: 0,
    clickRate: 0,
    status: 'FAILED',
  },
];
