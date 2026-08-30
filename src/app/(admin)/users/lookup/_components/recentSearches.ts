import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'adminRecentSearches';
const MAX_ENTRIES = 3;

/** Reads the last 3 saved search queries, most recent first. */
export async function loadRecentSearches(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** Prepends `query` to the recent-searches list (de-duplicated), capped at 3, and persists it. */
export async function saveRecentSearch(query: string): Promise<string[]> {
  const trimmed = query.trim();
  if (!trimmed) return loadRecentSearches();
  const existing = await loadRecentSearches();
  const next = [trimmed, ...existing.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

/** Clears all saved recent searches. */
export async function clearRecentSearches(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
