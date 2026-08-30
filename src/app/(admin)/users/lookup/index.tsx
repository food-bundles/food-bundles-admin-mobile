import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { lookupUser } from './_components/lookupSearch';
import { LookupResultCard } from './_components/LookupResultCard';
import { SampleUsersSection } from './_components/SampleUsersSection';
import { loadRecentSearches, saveRecentSearch, clearRecentSearches } from './_components/recentSearches';

/** Single search bar across restaurants/farmers/affiliators/admins, matched by id, email, or phone. */
export default function UserLookupScreen() {
  useRoleGuard('usersLookup');
  const { colors } = useTheme();
  const t = useT();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const results = useMemo(() => lookupUser(query), [query]);

  useEffect(() => {
    loadRecentSearches().then(setRecent);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => {
      saveRecentSearch(trimmed).then(setRecent);
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClearRecent = () => {
    clearRecentSearches().then(() => setRecent([]));
  };

  return (
    <AdminScreen title={t('lookup.title')}>
      <View style={styles.searchWrap}>
        <Input label={t('lookup.title')} value={query} onChangeText={setQuery} placeholder={t('lookup.placeholder')} />
      </View>
      {query.trim() === '' ? (
        <ScrollView contentContainerStyle={styles.browse}>
          {recent.length > 0 ? (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('lookup.recentSearchesTitle')}</Text>
                <Pressable onPress={handleClearRecent} accessibilityRole="button" accessibilityLabel={t('lookup.clearRecent')}>
                  <Text style={[styles.clearLink, { color: colors.leaf }]}>{t('lookup.clearRecent')}</Text>
                </Pressable>
              </View>
              {recent.map((entry) => (
                <Pressable
                  key={entry}
                  onPress={() => setQuery(entry)}
                  accessibilityRole="button"
                  accessibilityLabel={entry}
                  style={styles.recentRow}
                >
                  <Text style={[styles.recentText, { color: colors.body }]}>{entry}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <SampleUsersSection />
        </ScrollView>
      ) : results.length === 0 ? (
        <EmptyState icon={null} title={t('lookup.title')} message={t('lookup.noResults', { query })} />
      ) : (
        <ScrollView contentContainerStyle={styles.results}>
          {results.map((result) => (
            <LookupResultCard key={`${result.kind}-${result.record.id}`} result={result} />
          ))}
        </ScrollView>
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.md },
  browse: { paddingHorizontal: space.lg, gap: space.lg, paddingBottom: space.xxxl },
  recentSection: { gap: space.xs },
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...text.h3 },
  clearLink: { ...text.bodySemi },
  recentRow: { minHeight: 40, justifyContent: 'center' },
  recentText: { ...text.body },
  results: { paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.xxxl },
});
