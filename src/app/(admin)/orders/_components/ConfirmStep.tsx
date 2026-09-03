import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import { Card } from '@/components/ui/Card';
import type { OrderItem, PaymentMethod } from '@/mocks/orders';

export interface ConfirmStepProps {
  restaurantName: string;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

/** Step 5: final order summary before creation. */
export function ConfirmStep({ restaurantName, items, deliveryAddress, paymentMethod }: ConfirmStepProps) {
  const { colors } = useTheme();
  const t = useT();
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Card>
      <Text style={[styles.title, { color: colors.ink }]}>{t('orderBehalf.orderSummary')}</Text>
      <Text style={[styles.line, { color: colors.body }]}>{restaurantName}</Text>
      {items.map((item) => (
        <Text key={item.productId} style={[styles.line, { color: colors.body }]}>
          {item.name} × {item.qty} — {formatRwf(item.totalPrice)}
        </Text>
      ))}
      <Text style={[styles.line, { color: colors.muted }]}>{deliveryAddress}</Text>
      <Text style={[styles.line, { color: colors.muted }]}>{t(PAYMENT_METHOD_KEY[paymentMethod])}</Text>
      <View style={[styles.totalRow, { borderColor: colors.hairline }]}>
        <Text style={[styles.totalLabel, { color: colors.ink }]}>{t('orders.total')}</Text>
        <Text style={[styles.totalValue, { color: colors.leaf }]}>{formatRwf(total)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h3, marginBottom: space.sm },
  line: { ...text.body, marginBottom: space.xs },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: space.sm, borderTopWidth: 1, marginTop: space.sm },
  totalLabel: { ...text.bodySemi },
  totalValue: { ...text.h3 },
});
