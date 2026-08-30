import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import { formatRwf } from '@/lib/formatRwf';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MOCK_VOUCHERS } from '@/mocks/vouchers';
import type { PaymentMethod } from '@/mocks/orders';

const METHODS: PaymentMethod[] = ['CASH', 'MOBILE_MONEY', 'CARD', 'VOUCHER', 'BANK_TRANSFER'];

export interface PaymentStepProps {
  restaurantId: string;
  restaurantName: string;
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  phone: string;
  onChangePhone: (phone: string) => void;
  voucherId: string | null;
  onChangeVoucherId: (id: string | null) => void;
}

/**
 * Step 4: payment method select (all 5 real values — CASH/MOBILE_MONEY/CARD/VOUCHER/BANK_TRANSFER;
 * the codebase's real PaymentMethod type has 5 values including BANK_TRANSFER, not the 4-value set
 * a stale spec once described — see PROGRESS.md). MOBILE_MONEY shows a phone field, VOUCHER shows
 * this restaurant's available vouchers plus a "send payment request" mock action.
 */
export function PaymentStep({ restaurantId, restaurantName, value, onChange, phone, onChangePhone, voucherId, onChangeVoucherId }: PaymentStepProps) {
  const { colors } = useTheme();
  const t = useT();
  const [requestSent, setRequestSent] = useState(false);
  const availableVouchers = MOCK_VOUCHERS.filter((v) => v.restaurantId === restaurantId && v.status === 'AVAILABLE');

  return (
    <View style={styles.container}>
      <View style={styles.chipRow}>
        {METHODS.map((method) => {
          const active = method === value;
          return (
            <Pressable
              key={method}
              onPress={() => onChange(method)}
              accessibilityRole="button"
              accessibilityLabel={t(PAYMENT_METHOD_KEY[method])}
              accessibilityState={{ selected: active }}
              style={[styles.chip, { borderColor: colors.hairline }, active && { backgroundColor: colors.leaf, borderColor: colors.leaf }]}
            >
              <Text style={[styles.chipLabel, { color: active ? colors.paper : colors.body }]}>{t(PAYMENT_METHOD_KEY[method])}</Text>
            </Pressable>
          );
        })}
      </View>

      {value === 'MOBILE_MONEY' ? (
        <Input label={t('orderBehalf.phoneNumber')} value={phone} onChangeText={onChangePhone} keyboardType="phone-pad" />
      ) : null}

      {value === 'VOUCHER' ? (
        <View style={styles.voucherSection}>
          <Text style={[styles.label, { color: colors.ink }]}>{t('orderBehalf.selectVoucher')}</Text>
          {availableVouchers.length === 0 ? (
            <Text style={[styles.hint, { color: colors.muted }]}>{t('orderBehalf.noVouchers')}</Text>
          ) : (
            availableVouchers.map((voucher) => {
              const selected = voucherId === voucher.id;
              return (
                <Pressable
                  key={voucher.id}
                  onPress={() => onChangeVoucherId(voucher.id)}
                  accessibilityRole="button"
                  accessibilityLabel={voucher.code}
                  accessibilityState={{ selected }}
                  style={[styles.voucherRow, { borderColor: selected ? colors.leaf : colors.hairline }]}
                >
                  <Text style={[styles.voucherCode, { color: colors.ink }]}>{voucher.code}</Text>
                  <Text style={[styles.voucherAmount, { color: colors.leaf }]}>{formatRwf(voucher.amount)}</Text>
                </Pressable>
              );
            })
          )}
          <Button variant="secondary" fullWidth onPress={() => setRequestSent(true)}>
            {t('orderBehalf.sendPaymentRequest')}
          </Button>
          {requestSent ? (
            <Text style={[styles.hint, { color: colors.ripe }]}>{t('orderBehalf.paymentRequestSent', { restaurant: restaurantName })}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1 },
  chipLabel: { ...text.bodySemi },
  voucherSection: { gap: space.sm },
  label: { ...text.label },
  hint: { ...text.caption },
  voucherRow: { flexDirection: 'row', justifyContent: 'space-between', padding: space.sm, borderWidth: 1.5, borderRadius: 12 },
  voucherCode: { ...text.body },
  voucherAmount: { ...text.bodySemi },
});
