import { create } from 'zustand';
import { generateId } from '@/lib/id';
import { MOCK_CONTACT_SUBMISSIONS, type ContactSubmission, type ContactStatus, type ConversationMessage } from '@/mocks/contact-submissions';

export interface SendMessageInput {
  submissionId: string;
  text: string;
  attachmentName?: string;
  attachmentIsImage?: boolean;
  voiceUri?: string;
  voiceDurationMs?: number;
}

interface ContactSubmissionsState {
  submissions: ContactSubmission[];
  sendMessage: (input: SendMessageInput) => void;
  setStatus: (id: string, status: ContactStatus) => void;
}

/** Session-only mutable chat-thread state, seeded from MOCK_CONTACT_SUBMISSIONS. */
export const useContactSubmissionsStore = create<ContactSubmissionsState>((set) => ({
  submissions: MOCK_CONTACT_SUBMISSIONS,
  sendMessage: ({ submissionId, text, attachmentName, attachmentIsImage, voiceUri, voiceDurationMs }) =>
    set((state) => ({
      submissions: state.submissions.map((s) => {
        if (s.id !== submissionId) return s;
        const message: ConversationMessage = {
          id: generateId('msg'),
          from: 'admin',
          text,
          timestamp: new Date().toISOString(),
          attachmentName,
          attachmentIsImage,
          voiceUri,
          voiceDurationMs,
        };
        return { ...s, status: 'REPLIED', reply: text, messages: [...s.messages, message] };
      }),
    })),
  setStatus: (id, status) =>
    set((state) => ({ submissions: state.submissions.map((s) => (s.id === id ? { ...s, status } : s)) })),
}));
