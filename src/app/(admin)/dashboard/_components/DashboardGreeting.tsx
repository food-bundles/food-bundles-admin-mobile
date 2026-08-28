import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore, type TranslationKey } from '@/i18n';
import { formatDate } from '@/lib/date';

export interface DashboardGreetingProps {
  name: string;
  now?: Date;
}

function greetingKey(hour: number): TranslationKey {
  if (hour < 12) return 'dashboard.greetingMorning';
  if (hour < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

/** "Good morning, {name}" + current date, time-of-day aware. */
export function DashboardGreeting({ name, now = new Date() }: DashboardGreetingProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: colors.ink }]}>{t(greetingKey(now.getHours()), { name })}</Text>
      <Text style={[styles.date, { color: colors.muted }]}>{formatDate(now.toISOString(), language)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.lg },
  greeting: { ...text.h1 },
  date: { ...text.body, marginTop: space.xs },
});
