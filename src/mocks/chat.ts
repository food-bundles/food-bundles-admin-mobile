import { MOCK_RESTAURANTS } from './restaurants';
import { MOCK_ADMIN } from './auth';

export type ChatMessageKind = 'text' | 'voice' | 'file' | 'image';

export interface ChatMessage {
  id: string;
  senderId: string;
  kind: ChatMessageKind;
  body: string;
  attachment?: string;
  durationMs?: number;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export type ConversationKind = 'support' | 'peer';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  participantIds: string[];
  restaurantId: string;
  restaurantName: string;
  restaurantImageUri: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

export type CallKind = 'audio' | 'video';
export type CallState = 'ringing' | 'connecting' | 'active' | 'ended';

export interface CallSession {
  id: string;
  conversationId: string;
  kind: CallKind;
  state: CallState;
  startedAt: string;
  endedAt?: string;
}

const HOUR = 3_600_000;

function msg(id: string, senderId: string, body: string, hoursAgo: number, read: boolean): ChatMessage {
  const sentAt = new Date(Date.now() - hoursAgo * HOUR).toISOString();
  const deliveredAt = new Date(Date.now() - hoursAgo * HOUR + 4000).toISOString();
  return {
    id,
    senderId,
    kind: 'text',
    body,
    sentAt,
    deliveredAt,
    readAt: read ? new Date(Date.now() - hoursAgo * HOUR + 30000).toISOString() : undefined,
  };
}

const OPENING_LINES: string[] = [
  "Hi, we're running low on Irish potatoes — can you prioritise our next delivery?",
  'Thanks for the fast delivery yesterday, everything arrived fresh.',
  'Quick question about our wallet balance, can you check on your end?',
  'Is there a promo running on fresh vegetables this week?',
  'Our order FB-24812 delivery is later than expected, any update?',
  'Could we get an extra crate of tomatoes added to tomorrow’s order?',
  'Loved the new market prices — much more transparent than before.',
  'We would like to discuss switching to the Premium subscription.',
  'The affiliator account for our second branch needs to be set up.',
  'Can you confirm the delivery address for our Kacyiru branch?',
  'We had a discrepancy in last week’s invoice, can someone review it?',
  'Do you deliver on public holidays?',
  'Requesting a callback about a bulk order for a catering event.',
  'Great experience overall — just flagging a small packaging issue.',
  'Can we add a new affiliator to manage weekend orders?',
];

/** Deterministic per-restaurant admin userId used as the sole "admin" participant across every conversation. */
export const ADMIN_PARTICIPANT_ID = MOCK_ADMIN.id;

function buildConversation(restaurant: (typeof MOCK_RESTAURANTS)[number], index: number): Conversation {
  const opening = OPENING_LINES[index % OPENING_LINES.length];
  const restaurantSenderId = `rest-user-${restaurant.id}`;
  const hoursAgo = 1 + index * 3;
  const fromRestaurant = index % 3 !== 0;
  const lastMessage = msg(
    `${restaurant.id}-msg-last`,
    fromRestaurant ? restaurantSenderId : ADMIN_PARTICIPANT_ID,
    fromRestaurant ? opening : 'Noted — our team will follow up shortly.',
    hoursAgo,
    index % 4 !== 0,
  );

  return {
    id: `conv-${restaurant.id}`,
    kind: 'peer',
    participantIds: [ADMIN_PARTICIPANT_ID, restaurantSenderId],
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantImageUri: restaurant.imageUri,
    lastMessage,
    unreadCount: index % 4 === 0 ? 0 : (index % 3) + 1,
  };
}

/** One Conversation per restaurant, so admins have a real directory of restaurant-relationship threads to open. */
export const MOCK_CONVERSATIONS: Conversation[] = MOCK_RESTAURANTS.map(buildConversation);

function historyFor(conversation: Conversation): ChatMessage[] {
  const restaurantSenderId = conversation.participantIds.find((id) => id !== ADMIN_PARTICIPANT_ID) ?? conversation.participantIds[0];
  const openingIndex = MOCK_RESTAURANTS.findIndex((r) => r.id === conversation.restaurantId);
  const opening = OPENING_LINES[openingIndex % OPENING_LINES.length];

  return [
    msg(`${conversation.id}-m1`, restaurantSenderId, opening, 26, true),
    msg(`${conversation.id}-m2`, ADMIN_PARTICIPANT_ID, "Thanks for reaching out — let me look into that for you.", 25, true),
    conversation.lastMessage,
  ];
}

/** Full message history per conversation, seeded on top of MOCK_CONVERSATIONS. Keyed by conversation id. */
export const MOCK_CHAT_HISTORY: Record<string, ChatMessage[]> = Object.fromEntries(
  MOCK_CONVERSATIONS.map((conversation) => [conversation.id, historyFor(conversation)]),
);
