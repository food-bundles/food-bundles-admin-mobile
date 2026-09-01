export type ContactStatus = 'UNREAD' | 'READ' | 'REPLIED';

export interface ConversationMessage {
  id: string;
  from: 'contact' | 'admin';
  text: string;
  timestamp: string;
  attachmentName?: string;
  attachmentIsImage?: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  status: ContactStatus;
  reply: string | null;
  /** Full chat thread: the original submission plus 0-2 admin replies when status is REPLIED. */
  messages: ConversationMessage[];
}

function thread(id: string, originalText: string, submittedAt: string, reply: string | null): ConversationMessage[] {
  const messages: ConversationMessage[] = [{ id: `${id}-m1`, from: 'contact', text: originalText, timestamp: submittedAt }];
  if (reply) {
    const replyTime = new Date(new Date(submittedAt).getTime() + 6 * 3_600_000).toISOString();
    messages.push({ id: `${id}-m2`, from: 'admin', text: reply, timestamp: replyTime });
  }
  return messages;
}

const RAW_SUBMISSIONS: Omit<ContactSubmission, 'messages'>[] = [
  {
    id: 'contact-001',
    name: 'Jean Pierre Habyarimana',
    email: 'jp.habyarimana@gmail.com',
    message: 'How do I register my restaurant on FoodBundles?',
    submittedAt: '2026-08-25T09:00:00Z',
    status: 'UNREAD',
    reply: null,
  },
  {
    id: 'contact-002',
    name: 'Fiona Ingabire',
    email: 'fiona.ingabire@gmail.com',
    message: 'I would like to become a farmer supplier — what is the process?',
    submittedAt: '2026-08-20T10:30:00Z',
    status: 'REPLIED',
    reply: 'Thanks for reaching out — please register via the Farmers section and our team will review your submission within 2 business days.',
  },
  {
    id: 'contact-003',
    name: 'Moses Karangwa',
    email: 'moses.karangwa@gmail.com',
    message: 'My wallet top-up is not reflecting on my account.',
    submittedAt: '2026-08-24T14:00:00Z',
    status: 'READ',
    reply: null,
  },
  {
    id: 'contact-004',
    name: 'Sarah Uwamahoro',
    email: 'sarah.uwamahoro@gmail.com',
    message: "Can I get an invoice for last month's orders for tax purposes?",
    submittedAt: '2026-08-18T08:15:00Z',
    status: 'REPLIED',
    reply: 'You can download monthly invoices from your restaurant dashboard under Reports.',
  },
  {
    id: 'contact-005',
    name: 'Daniel Rwigamba',
    email: 'daniel.rwigamba@gmail.com',
    message: 'Interested in a bulk discount for weekly Premium orders.',
    submittedAt: '2026-08-22T11:00:00Z',
    status: 'UNREAD',
    reply: null,
  },
  {
    id: 'contact-006',
    name: 'Immaculee Nirere',
    email: 'immaculee.nirere@gmail.com',
    message: 'I was charged twice for order FB-24816, please refund.',
    submittedAt: '2026-08-26T07:45:00Z',
    status: 'UNREAD',
    reply: null,
  },
  {
    id: 'contact-007',
    name: 'Thomas Bizimana',
    email: 'thomas.bizimana@gmail.com',
    message: 'Do you deliver outside Kigali city?',
    submittedAt: '2026-08-14T13:30:00Z',
    status: 'REPLIED',
    reply: 'Currently we only cover Kigali and surrounding districts, but we are expanding soon.',
  },
  {
    id: 'contact-008',
    name: 'Vanessa Mutesi',
    email: 'vanessa.mutesi@gmail.com',
    message: 'Feedback: the app is great, but loan approval took a while.',
    submittedAt: '2026-08-16T09:50:00Z',
    status: 'READ',
    reply: null,
  },
];

/** 8 contact form submissions: mix of READ, UNREAD, REPLIED. Each carries a full messages[] thread. */
export const MOCK_CONTACT_SUBMISSIONS: ContactSubmission[] = RAW_SUBMISSIONS.map((s) => ({
  ...s,
  messages: thread(s.id, s.message, s.submittedAt, s.reply),
}));
