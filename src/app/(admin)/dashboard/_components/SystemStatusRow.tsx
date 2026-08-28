import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme, type ColorPalette } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Card } from '@/components/ui/Card';

interface SystemService {
  labelKey: TranslationKey;
  operational: boolean;
}

const SERVICES: SystemService[] = [
  { labelKey: 'dashboard.statusApi', operational: true },
  { labelKey: 'dashboard.statusWebSocket', operational: true },
  { labelKey: 'dashboard.statusDatabase', operational: true },
];

/** API / WebSocket / Database, each a green-or-red dot + label. All mocked as operational. */
export function SystemStatusRow() {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('dashboard.systemStatus')}</Text>
      <Card>
        <View style={styles.row}>
          {SERVICES.map((service) => (
            <View key={service.labelKey} style={styles.item}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: colors[dotColor(service.operational)] },
                ]}
              />
              <Text style={[styles.label, { color: colors.body }]}>{t(service.labelKey)}</Text>
              <Text style={[styles.state, { color: colors[dotColor(service.operational)] }]}>
                {t(service.operational ? 'dashboard.statusOperational' : 'dashboard.statusDown')}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function dotColor(operational: boolean): keyof ColorPalette {
  return operational ? 'ripe' : 'chili';
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
