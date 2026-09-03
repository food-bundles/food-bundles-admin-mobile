import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib/formatRwf';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useVouchersStore } from '@/stores/vouchersStore';
import { MOCK_RESTAURANTS, type Restaurant } from '@/mocks/restaurants';
import { MOCK_LOAN_APPLICATIONS } from '@/mocks/loanApplications';

export interface CreateVoucherSheetProps {
  visible: boolean;
  onClose: () => void;
}

function approvedLimitFor(restaurantId: string): number {
  const latest = [...MOCK_LOAN_APPLICATIONS]
    .filter((a) => a.restaurantId === restaurantId && a.status === 'APPROVED')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
  return latest?.approvedLimit ?? 0;
}

/** ADMIN+ sheet: select restaurant, amount within their approved credit limit, mock-creates a voucher and shows its code. */
export function CreateVoucherSheet({ visible, onClose }: CreateVoucherSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const createVoucher = useVouchersStore((state) => state.createVoucher);
  const [search, setSearch] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [amount, setAmount] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const matches = MOCK_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));
  const limit = restaurant ? approvedLimitFor(restaurant.id) : 0;
  const parsedAmount = Number(amount) || 0;
  const canCreate = restaurant !== null && parsedAmount > 0 && parsedAmount <= limit;

  const handleClose = () => {
    setSearch('');
    setRestaurant(null);
    setAmount('');
    setCreatedCode(null);
    onClose();
  };

  const handleCreate = () => {
    if (!restaurant || !canCreate) return;
    const voucher = createVoucher({ restaurantId: restaurant.id, restaurantName: restaurant.name, amount: parsedAmount });
    setCreatedCode(voucher.code);
  };

  return (
    <Sheet visible={visible} height="tall" onClose={handleClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers.createOnBehalfTitle')}</Text>

        {createdCode ? (
          <Text style={[styles.success, { color: colors.ripe }]}>{t('vouchers.createSuccess', { code: createdCode })}</Text>
        ) : (
          <>
            <Input label={t('orderBehalf.searchRestaurant')} value={search} onChangeText={setSearch} />
            {matches.slice(0, 5).map((r) => (
              <Pressable
                key={r.id}
                onPress={() => setRestaurant(r)}
                accessibilityRole="button"
                accessibilityLabel={r.name}
                accessibilityState={{ selected: restaurant?.id === r.id }}
                style={[styles.optionRow, { borderColor: restaurant?.id === r.id ? colors.leaf : colors.hairline }]}
              >
                <Text style={[styles.optionLabel, { color: colors.ink }]}>{r.name}</Text>
              </Pressable>
            ))}

            {restaurant ? (
              <View style={styles.limitRow}>
                <Text style={[styles.limitLabel, { color: colors.muted }]}>{t('vouchers.approvedLimit')}</Text>
                <Text style={[styles.limitValue, { color: colors.ink }]}>{formatRwf(limit)}</Text>
              </View>
            ) : null}

            <Input label={t('vouchers.voucherAmount')} value={amount} onChangeText={setAmount} keyboardType="numeric" />
            <Button variant="primary" fullWidth disabled={!canCreate} onPress={handleCreate}>
              {t('vouchers.createOnBehalfTitle')}
            </Button>
          </>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2, marginBottom: space.md },
  success: { ...text.bodySemi },
  optionRow: { padding: space.sm, borderWidth: 1.5, borderRadius: radius.md, marginBottom: space.xs },
  optionLabel: { ...text.body },
  limitRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: space.sm },
  limitLabel: { ...text.body },
  limitValue: { ...text.bodySemi },
});
