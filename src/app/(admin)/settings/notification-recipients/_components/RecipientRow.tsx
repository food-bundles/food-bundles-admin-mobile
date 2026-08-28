import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { NotificationRecipient } from '@/mocks/notification-recipients';

export interface RecipientRowProps {
  recipient: NotificationRecipient;
  onEdit: () => void;
  onDelete: () => void;
}

/** Name + email + channel chips + status toggle (edit/delete actions). */
export function RecipientRow({ recipient, onEdit, onDelete }: RecipientRowProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Card onPress={onEdit} accessibilityLabel={recipient.name}>
      <View style={styles.header}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{recipient.name}</Text>
          <Text style={[styles.email, { color: colors.muted }]}>{recipient.email}</Text>
        </View>
        <Badge tone={recipient.active ? 'leaf' : 'neutral'} label={t(recipient.active ? 'settings.statusActive' : 'settings.statusInactive')} />
      </View>
      <View style={styles.chipRow}>
        {recipient.channels.map((channel) => (
          <Badge key={channel} tone="neutral" label={channel} />
        ))}
      </View>
      <View style={styles.deleteWrap}>
        <Button variant="ghost" size="sm" onPress={onDelete}>
          {t('common.delete')}
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  email: { ...text.caption, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, marginTop: space.sm },
  deleteWrap: { alignItems: 'flex-end', marginTop: space.sm },
});
