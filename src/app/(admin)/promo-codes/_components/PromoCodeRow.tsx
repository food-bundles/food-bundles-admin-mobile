import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { PromoCode } from '@/mocks/promo-codes';

type PromoStatus = 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED';

function statusOf(code: PromoCode, now: Date): PromoStatus {
  if (code.usedCount >= code.maxUses) return 'EXHAUSTED';
  if (new Date(code.expiresAt).getTime() < now.getTime()) return 'EXPIRED';
  return 'ACTIVE';
}

const STATUS_TONE = { ACTIVE: 'leaf', EXPIRED: 'chili', EXHAUSTED: 'neutral' } as const;
const STATUS_KEY: Record<PromoStatus, TranslationKey> = {
  ACTIVE: 'promoCodes.statusActive',
  EXPIRED: 'promoCodes.statusExpired',
  EXHAUSTED: 'promoCodes.statusExhausted',
};

export interface PromoCodeRowProps {
  code: PromoCode;
}

/** Code (monospace) + type badge + value + uses (N/max) + expiry + status chip. */
export function PromoCodeRow({ code }: PromoCodeRowProps) {
  const { colors } = useTheme();
  const t = useT();
  const status = statusOf(code, new Date());
  const value = code.type === 'PERCENT' ? `${code.value}%` : formatRwf(code.value);

  return (
    <Card onPress={() => router.push(`/(admin)/promo-codes/${code.id}`)} accessibilityLabel={code.code}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.code, { color: colors.ink }]}>{code.code}</Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            {value} · {t('promoCodes.uses', { used: code.usedCount, max: code.maxUses })}
          </Text>
        </View>
        <Badge tone={STATUS_TONE[status]} label={t(STATUS_KEY[status])} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  code: { ...text.bodySemi, fontFamily: 'IBMPlexSans_600SemiBold', letterSpacing: 0.5 },
  detail: { ...text.caption, marginTop: 2 },
});
