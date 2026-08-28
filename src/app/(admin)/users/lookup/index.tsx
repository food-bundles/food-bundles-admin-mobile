import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { space } from '@/theme';
import { useT } from '@/i18n';
import { useRoleGuard } from '@/lib/roleGuard';
import { AdminScreen } from '@/components/layout/AdminScreen';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { lookupUser } from './_components/lookupSearch';
import { LookupResultCard } from './_components/LookupResultCard';

/** Single search bar across restaurants/farmers/affiliators/admins, matched by id, email, or phone. */
export default function UserLookupScreen() {
  useRoleGuard('usersLookup');
  const t = useT();
  const [query, setQuery] = useState('');
  const results = useMemo(() => lookupUser(query), [query]);

  return (
    <AdminScreen title={t('lookup.title')}>
      <View style={styles.searchWrap}>
        <Input label={t('lookup.title')} value={query} onChangeText={setQuery} placeholder={t('lookup.placeholder')} />
      </View>
      {query.trim() === '' ? (
        <EmptyState icon={null} title={t('lookup.title')} message={t('lookup.emptyPrompt')} />
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
  results: { paddingHorizontal: space.lg, gap: space.sm, paddingBottom: space.xxxl },
});
