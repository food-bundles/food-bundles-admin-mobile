import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import type { Invitation, InvitationStatus } from '@/mocks/invitations';

const STATUS_TONE: Record<InvitationStatus, 'marigold' | 'leaf' | 'chili'> = {
  PENDING: 'marigold',
  ACCEPTED: 'leaf',
  EXPIRED: 'chili',
};

export interface InvitationRowProps {
  invitation: Invitation;
}

/** Email + role badge + status + sent/expires dates. */
export function InvitationRow({ invitation }: InvitationRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);

  return (
    <Card accessibilityLabel={invitation.email}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.email, { color: colors.ink }]}>{invitation.email}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {invitation.status === 'PENDING'
              ? t('invitations.expiresAt', { date: formatDate(invitation.expiresAt, language) })
              : t('invitations.sentAt', { date: formatDate(invitation.sentAt, language) })}
          </Text>
        </View>
        <View style={styles.trailing}>
          <RoleBadge role={invitation.role} />
          <Badge tone={STATUS_TONE[invitation.status]} label={invitation.status} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  email: { ...text.bodySemi },
  detail: { ...text.caption, marginTop: 2 },
  trailing: { alignItems: 'flex-end', gap: space.xs },
});
