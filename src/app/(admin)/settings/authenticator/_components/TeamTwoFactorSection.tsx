import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { teamTwoFactorStatuses } from './teamActivity';

/** SUPER_ADMIN-only "Team 2FA Status": each admin's enabled/disabled state, mock last-used date, "Send reminder" for disabled ones. */
export function TeamTwoFactorSection() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const statuses = teamTwoFactorStatuses();
  const [reminded, setReminded] = useState<Record<string, boolean>>({});

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('settings.teamTwoFactorTitle')}</Text>
      {statuses.map(({ admin, enabled, lastUsedAt }) => (
        <View key={admin.id} style={[styles.row, { borderBottomColor: colors.hairline }]}>
          <View style={styles.textCol}>
            <Text style={[styles.name, { color: colors.ink }]}>{admin.name}</Text>
            {enabled ? (
              <View style={styles.statusRow}>
                <Ionicons name="checkmark-circle" size={14} color={colors.ripe} />
                <Text style={[styles.statusLabel, { color: colors.ripe }]}>
                  {t('settings.twoFaEnabled')} · {lastUsedAt ? formatDate(lastUsedAt, language) : ''}
                </Text>
              </View>
            ) : (
              <View style={styles.statusRow}>
                <Ionicons name="close-circle" size={14} color={colors.chili} />
                <Text style={[styles.statusLabel, { color: colors.chili }]}>{t('settings.twoFaNotEnabled')}</Text>
              </View>
            )}
          </View>
          {!enabled ? (
            <Button variant="ghost" size="sm" onPress={() => setReminded((prev) => ({ ...prev, [admin.id]: true }))}>
              {t(reminded[admin.id] ? 'settings.reminderSent' : 'settings.sendReminder')}
            </Button>
          ) : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm, borderBottomWidth: 1 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusLabel: { ...text.caption },
});
