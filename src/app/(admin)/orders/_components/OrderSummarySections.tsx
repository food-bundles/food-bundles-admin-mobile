import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Card } from '@/components/ui/Card';
import type { Order } from '@/mocks/orders';

export interface OrderSummarySectionsProps {
  order: Order;
}

const VAT_RATE = 0.18;
const DELIVERY_FEE = 0;

/** Totals breakdown, payment info, and delivery address — three small read-only sections. */
export function OrderSummarySections({ order }: OrderSummarySectionsProps) {
  const { colors } = useTheme();
  const t = useT();
  const subtotal = order.total / (1 + VAT_RATE);
  const vat = order.total - subtotal;

  return (
    <View style={styles.container}>
      <Card>
        <Row label={t('orders.subtotal')} value={formatRwf(subtotal)} />
        <Row label={t('orders.delivery')} value={formatRwf(DELIVERY_FEE)} />
        <Row label={t('orders.vat')} value={formatRwf(vat)} />
        <Row label={t('orders.total')} value={formatRwf(order.total)} emphasis />
      </Card>

      <Text style={[styles.title, { color: colors.ink }]}>{t('orders.paymentInfo')}</Text>
      <Card>
        <Row label={t('orders.paymentInfo')} value={order.paymentMethod.replace('_', ' ')} />
        <Row label={t('orders.paymentReference')} value={order.id} />
      </Card>

      <Text style={[styles.title, { color: colors.ink }]}>{t('orders.deliveryAddress')}</Text>
      <Card>
        <Text style={[styles.address, { color: colors.body }]}>{order.deliveryAddress}</Text>
      </Card>
    </View>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[emphasis ? styles.rowValueEmphasis : styles.rowValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: space.lg, gap: space.md },
  title: { ...text.h3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: space.xs },
  rowLabel: { ...text.body },
  rowValue: { ...text.body },
  rowValueEmphasis: { ...text.bodySemi },
  address: { ...text.body },
});
