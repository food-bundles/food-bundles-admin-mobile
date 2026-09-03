import { create } from 'zustand';
import { MOCK_FARMER_SUBMISSIONS, type FarmerSubmission, type SubmissionStatus } from '@/mocks/farmer-submissions';

export type SubmissionGrade = 'A' | 'B' | 'C' | 'REJECTED';

export interface SubmissionOverride {
  status: SubmissionStatus;
  grade?: SubmissionGrade;
  counterOfferPrice?: number;
}

interface FarmerSubmissionsState {
  submissions: FarmerSubmission[];
  overrides: Record<string, SubmissionOverride>;
  setStatus: (id: string, status: SubmissionStatus, grade?: SubmissionGrade, counterOfferPrice?: number) => void;
  getEffective: (submission: FarmerSubmission) => FarmerSubmission & { grade?: SubmissionGrade; counterOfferPrice?: number };
}

/**
 * Session-only farmer-submission state, seeded from the mock list. Approve/Reject/Verify actions
 * (from both the list's quick-actions and the detail screen) write here so navigating back to the
 * list reflects the change — the two screens previously each held their own local `statusOverride`
 * state, which meant the list forgot any action taken from the detail screen the moment you left it.
 */
export const useFarmerSubmissionsStore = create<FarmerSubmissionsState>((set, get) => ({
  submissions: MOCK_FARMER_SUBMISSIONS,
  overrides: {},
  setStatus: (id, status, grade, counterOfferPrice) =>
    set((state) => ({
      overrides: { ...state.overrides, [id]: { status, grade, counterOfferPrice } },
    })),
  getEffective: (submission) => {
    const override = get().overrides[submission.id];
    if (!override) return submission;
    return { ...submission, status: override.status, grade: override.grade, counterOfferPrice: override.counterOfferPrice };
  },
}));
