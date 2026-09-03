import { useBackgroundTaskStore } from '@/stores/backgroundTaskStore';

/**
 * Mock background-sync task. The app is fully mocked (no fetch/API), so
 * there is no real Expo TaskManager registration here — this function is
 * the single place a future real implementation would call `recordRun()`
 * from, and it documents the contract the System Status row (Section 5)
 * depends on: `backgroundTaskStore.lastRunAt` reflects "last time this
 * ran successfully".
 */
export function runBackgroundSync(): void {
  useBackgroundTaskStore.getState().recordRun();
}
