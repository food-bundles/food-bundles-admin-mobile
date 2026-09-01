import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_CAMPAIGNS, type Campaign } from '@/mocks/newsletter';

interface NewsletterState {
  campaigns: Campaign[];
  sendNow: (id: string) => void;
  duplicate: (id: string) => Campaign | null;
}

/** Session-only mutable campaign state seeded from MOCK_CAMPAIGNS. */
export const useNewsletterStore = create<NewsletterState>((set, get) => ({
  campaigns: MOCK_CAMPAIGNS,
  sendNow: (id) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status: 'SENT', sentAt: new Date().toISOString(), recipientCount: 25, openRate: 0, clickRate: 0 } : c,
      ),
    })),
  duplicate: (id) => {
    const source = get().campaigns.find((c) => c.id === id);
    if (!source) return null;
    const copy: Campaign = {
      ...source,
      id: generateId('camp'),
      subject: `${source.subject} (copy)`,
      status: 'DRAFT',
      sentAt: null,
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
    };
    set((state) => ({ campaigns: [copy, ...state.campaigns] }));
    return copy;
  },
}));
