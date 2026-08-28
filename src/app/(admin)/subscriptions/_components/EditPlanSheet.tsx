import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { SubscriptionPlan } from '@/mocks/subscriptions';

export interface EditPlanSheetProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (monthlyPrice: number, weeklyPrice: number) => void;
}

/** Edit a plan's monthly/weekly price. Local-only, no persistence. SUPERUSER only (gated by the caller). */
export function EditPlanSheet({ plan, onClose, onSave }: EditPlanSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [monthly, setMonthly] = useState(String(plan?.monthlyPrice ?? ''));
  const [weekly, setWeekly] = useState(String(plan?.weeklyPrice ?? ''));

  if (!plan) return null;

  const handleSubmit = () => {
    onSave(Number(monthly) || plan.monthlyPrice, Number(weekly) || plan.weeklyPrice);
    onClose();
  };

  return (
    <Sheet visible={plan !== null} height="medium" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('subscriptions.editPlan')}</Text>
        <Input label={`${t('products.fieldPrice')} (${t('subscriptions.monthly')})`} value={monthly} onChangeText={setMonthly} keyboardType="numeric" />
        <Input label={`${t('products.fieldPrice')} (${t('subscriptions.weekly')})`} value={weekly} onChangeText={setWeekly} keyboardType="numeric" />
        <Button variant="primary" fullWidth onPress={handleSubmit}>
          {t('common.save')}
        </Button>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  title: { ...text.h2 },
});
