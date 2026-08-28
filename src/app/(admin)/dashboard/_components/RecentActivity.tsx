import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatRelative } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications';

/** Last 8 notification events, newest first — reuses the notifications mock as the activity feed source. */
export function RecentActivity() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  const events = [...MOCK_NOTIFICATIONS]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.recentActivity')}</Text>
      <Card>
        {events.map((event, index) => (
          <View
            key={event.id}
            style={[styles.row, index < events.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}
          >
            <View style={styles.textCol}>
              <Text style={[styles.eventTitle, { color: colors.ink }]}>{event.title}</Text>
              <Text style={[styles.eventBody, { color: colors.muted }]} numberOfLines={1}>
                {event.body}
              </Text>
            </View>
            <Text style={[styles.time, { color: colors.muted }]}>{formatRelative(event.timestamp, language, t)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg },
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, gap: space.sm },
  textCol: { flex: 1 },
  eventTitle: { ...text.bodySemi },
  eventBody: { ...text.caption, marginTop: 2 },
  time: { ...text.micro },
});
