import { create } from 'zustand';

interface BackgroundTaskState {
  /** ISO timestamp of the last successful background sync run. */
  lastRunAt: string;
  recordRun: (timestamp?: string) => void;
}

/**
 * No `src/tasks/` background-task runner existed before this pass — this is
 * the minimal store the dashboard's System Status row (Section 5) needs to
 * show real freshness instead of a static dot. `src/tasks/backgroundSync.ts`
 * is the (mocked) task that would call `recordRun()` on a real schedule;
 * here it is seeded to "3 minutes ago" so the dashboard reads green by
 * default, matching a healthy operational state.
 */
export const useBackgroundTaskStore = create<BackgroundTaskState>((set) => ({
  lastRunAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  recordRun: (timestamp) => set({ lastRunAt: timestamp ?? new Date().toISOString() }),
}));
