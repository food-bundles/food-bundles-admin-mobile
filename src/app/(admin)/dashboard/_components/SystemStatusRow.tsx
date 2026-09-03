import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { useBackgroundTaskStore } from '@/stores/backgroundTaskStore';
import { latestMarketPriceDate } from '@/mocks/market-prices';
import { Card } from '@/components/ui/Card';

type StatusLevel = 'green' | 'amber' | 'red';

const LEVEL_COLOR: Record<StatusLevel, keyof ColorPalette> = { green: 'ripe', amber: 'marigold', red: 'chili' };
const LEVEL_LABEL_KEY: Record<StatusLevel, TranslationKey> = {
  green: 'dashboard.statusOperational',
  amber: 'dashboard.statusDelayed',
  red: 'dashboard.statusDown',
};

function backgroundTaskLevel(lastRunAt: string, now: Date): StatusLevel {
  const minutesAgo = (now.getTime() - new Date(lastRunAt).getTime()) / 60000;
  if (minutesAgo <= 20) return 'green';
  if (minutesAgo <= 60) return 'amber';
  return 'red';
}

function marketDataLevel(latestDate: string, now: Date): StatusLevel {
  if (!latestDate) return 'red';
  const daysAgo = Math.floor((now.getTime() - new Date(latestDate).getTime()) / 86_400_000);
  if (daysAgo <= 0) return 'green';
  if (daysAgo === 1) return 'amber';
  return 'red';
}

export interface SystemStatusRowProps {
  now?: Date;
}

/** API (always green) / Background tasks (from backgroundTaskStore) / Market data (from latest price date). */
export function SystemStatusRow({ now = new Date() }: SystemStatusRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const lastRunAt = useBackgroundTaskStore((state) => state.lastRunAt);

  const services: { labelKey: TranslationKey; level: StatusLevel }[] = [
    { labelKey: 'dashboard.statusApi', level: 'green' },
    { labelKey: 'dashboard.statusBackgroundTasks', level: backgroundTaskLevel(lastRunAt, now) },
    { labelKey: 'dashboard.statusMarketData', level: marketDataLevel(latestMarketPriceDate(), now) },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.systemStatus')}</Text>
      <Card>
        <View style={styles.row}>
          {services.map((service) => (
            <View key={service.labelKey} style={styles.item}>
              <View style={[styles.dot, { backgroundColor: colors[LEVEL_COLOR[service.level]] }]} />
              <Text style={[styles.label, { color: colors.body }]}>{t(service.labelKey)}</Text>
              <Text style={[styles.state, { color: colors[LEVEL_COLOR[service.level]] }]}>{t(LEVEL_LABEL_KEY[service.level])}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'column', gap: space.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { ...text.body, flex: 1 },
  state: { ...text.caption },
});
