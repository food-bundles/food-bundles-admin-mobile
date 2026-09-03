import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { BarChart } from '@/components/charts/BarChart';
import { useAuthStore } from '@/stores/authStore';
import { teamActivityLog, verificationsPerDay } from './teamActivity';

type FilterKey = 'ALL' | 'MINE' | 'FAILED';

/** "Activity log": last 10 mock 2FA verification events (timestamp, admin, mock IP, result), filterable, plus a 7-day success-count BarChart. */
export function ActivityLogSection() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const currentUser = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const log = teamActivityLog();
  const verifications = verificationsPerDay();

  const filtered = log.filter((entry) => {
    if (filter === 'MINE') return entry.admin.id === currentUser?.id;
    if (filter === 'FAILED') return entry.result === 'FAILED';
    return true;
  });

  const chips: FilterChip[] = [
    { key: 'ALL', label: t('orders.filterAll') },
    { key: 'MINE', label: t('settings.thisAdmin') },
    { key: 'FAILED', label: t('settings.failedOnly') },
  ];

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.title, { color: colors.ink }]}>{t('settings.verificationsChart')}</Text>
        <BarChart data={verifications} colorKey="leaf" height={120} />
      </Card>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('settings.activityLog')}</Text>
      <FilterBar chips={chips} activeKey={filter} onSelect={(key) => setFilter(key as FilterKey)} />
      {filtered.map((entry) => (
        <Card key={entry.id} accessibilityLabel={entry.admin.name}>
          <View style={styles.row}>
            <Image source={{ uri: entry.admin.avatarUri }} style={styles.avatar} />
            <View style={styles.textCol}>
              <Text style={[styles.name, { color: colors.ink }]}>{entry.admin.name}</Text>
              <Text style={[styles.detail, { color: colors.muted }]}>
                {entry.ip} · {formatDate(entry.timestamp, language)}
              </Text>
            </View>
            <Badge tone={entry.result === 'SUCCESS' ? 'ripe' : 'chili'} label={t(entry.result === 'SUCCESS' ? 'settings.resultSuccess' : 'settings.resultFailed')} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  title: { ...text.h3, marginBottom: space.sm },
  sectionTitle: { ...text.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
});
