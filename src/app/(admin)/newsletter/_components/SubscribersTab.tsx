import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { DataList } from '@/components/data/DataList';
import { Card } from '@/components/ui/Card';
import { MOCK_SUBSCRIBERS } from '@/mocks/newsletter';

/** Subscriber list: email + subscribed date. */
export function SubscribersTab() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <View style={styles.container}>
      <Text style={[styles.count, { color: colors.muted }]}>{t('newsletter.subscriberCount', { count: MOCK_SUBSCRIBERS.length })}</Text>
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
  container: { flex: 1 },
  count: { ...text.caption, paddingHorizontal: space.lg, paddingVertical: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  email: { ...text.bodySemi },
  detail: { ...text.caption },
});
