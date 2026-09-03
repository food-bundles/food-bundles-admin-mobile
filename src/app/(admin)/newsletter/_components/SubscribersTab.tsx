import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { shareCsv } from '@/lib/exportCsv';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AreaChart } from '@/components/charts/AreaChart';
import { MOCK_SUBSCRIBERS } from '@/mocks/newsletter';

function growthByDay(): { x: number; y: number }[] {
  const days = 30;
  const sorted = [...MOCK_SUBSCRIBERS].sort((a, b) => new Date(a.subscribedAt).getTime() - new Date(b.subscribedAt).getTime());
  const earliest = new Date(sorted[0]?.subscribedAt ?? new Date()).getTime();
  const points = Array.from({ length: days }, (_, x) => ({ x, y: 0 }));
  let cumulative = 0;
  for (const point of points) {
    const dayTime = earliest + point.x * 86_400_000;
    cumulative = sorted.filter((s) => new Date(s.subscribedAt).getTime() <= dayTime).length;
    point.y = cumulative;
  }
  return points;
}

function subscribersCsv(): string {
  const header = 'email,subscribedAt';
  const rows = MOCK_SUBSCRIBERS.map((s) => `${s.email},${s.subscribedAt}`);
  return [header, ...rows].join('\n');
}

/** Subscriber list: email + subscribed date, plus a 30-day growth AreaChart and "Export subscribers". */
export function SubscribersTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const growth = growthByDay();

  return (
    <View style={styles.container}>
      <Card>
        <Text style={[styles.chartTitle, { color: colors.ink }]}>{t('newsletter.subscriberGrowth')}</Text>
        <AreaChart data={growth} colorKey="leaf" height={140} />
      </Card>
      <View style={styles.headerRow}>
        <Text style={[styles.count, { color: colors.muted }]}>{t('newsletter.subscriberCount', { count: MOCK_SUBSCRIBERS.length })}</Text>
        <Button variant="ghost" size="sm" onPress={() => shareCsv('subscribers.csv', subscribersCsv())}>
          {t('newsletter.exportSubscribers')}
        </Button>
      </View>
      <DataList
        data={MOCK_SUBSCRIBERS}
        renderItem={({ item }) => (
          <Card accessibilityLabel={item.email}>
            <View style={styles.row}>
              <Text style={[styles.email, { color: colors.ink }]}>{item.email}</Text>
              <Text style={[styles.detail, { color: colors.muted }]}>{formatDate(item.subscribedAt, language)}</Text>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isEmpty={MOCK_SUBSCRIBERS.length === 0}
        emptyTitle={t('newsletter.emptySubscribersTitle')}
        emptyMessage={t('newsletter.emptySubscribersMessage')}
        emptyIcon={<Ionicons name="mail-outline" size={20} color={colors.leaf} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: space.sm },
  chartTitle: { ...text.h3, marginBottom: space.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: space.sm },
  count: { ...text.caption },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  email: { ...text.bodySemi },
  detail: { ...text.caption },
});
