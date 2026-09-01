import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { PAYMENT_METHOD_KEY } from '@/lib/paymentMethodLabel';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDepositsStore } from '@/stores/depositsStore';
import type { PaymentMethod } from '@/mocks/orders';
import type { Wallet } from '@/mocks/deposits';

export interface TopUpWalletSheetProps {
  wallet: Wallet | null;
  onClose: () => void;
}

const METHODS: PaymentMethod[] = ['CASH', 'MOBILE_MONEY', 'CARD', 'BANK_TRANSFER'];

/** ADMIN+ sheet: amount + payment method → mock top-up updates the wallet balance in the store. */
export function TopUpWalletSheet({ wallet, onClose }: TopUpWalletSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const topUp = useDepositsStore((state) => state.topUp);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('MOBILE_MONEY');
  const [done, setDone] = useState(false);

  const handleClose = () => {
    setAmount('');
    setDone(false);
    onClose();
  };

  const handleTopUp = () => {
    if (!wallet) return;
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    topUp(wallet.id, parsed, method);
    setDone(true);
  };

  return (
    <Sheet visible={wallet !== null} height="medium" onClose={handleClose}>
      {wallet ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: colors.ink }]}>{t('deposits.topUpWallet')}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{wallet.restaurantName}</Text>

          {done ? (
            <Text style={[styles.success, { color: colors.ripe }]}>{t('deposits.topUpSuccess')}</Text>
          ) : (
            <>
              <Input label={t('deposits.amount')} value={amount} onChangeText={setAmount} keyboardType="numeric" />
              <View style={styles.chipRow}>
                {METHODS.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMethod(m)}
                    accessibilityRole="button"
                    accessibilityLabel={t(PAYMENT_METHOD_KEY[m])}
                    accessibilityState={{ selected: method === m }}
                    style={[styles.chip, { borderColor: colors.hairline }, method === m && { backgroundColor: colors.leaf, borderColor: colors.leaf }]}
                  >
                    <Text style={[styles.chipLabel, { color: method === m ? colors.paper : colors.body }]}>{t(PAYMENT_METHOD_KEY[m])}</Text>
                  </Pressable>
                ))}
              </View>
              <Button variant="primary" fullWidth onPress={handleTopUp}>
                {t('deposits.topUpWallet')}
              </Button>
            </>
          )}
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2 },
  subtitle: { ...text.body, marginBottom: space.md },
  success: { ...text.bodySemi },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginVertical: space.md },
  chip: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1 },
  chipLabel: { ...text.bodySemi },
});
