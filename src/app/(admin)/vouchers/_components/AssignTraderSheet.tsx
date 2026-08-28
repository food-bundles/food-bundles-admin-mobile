import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Card } from '@/components/ui/Card';
import { MOCK_ADMINS } from '@/mocks/admins';

export interface AssignTraderSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (traderId: string) => void;
}

/** Picks one of the TRADER-role admins to assign to a voucher. */
export function AssignTraderSheet({ visible, onClose, onSelect }: AssignTraderSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const traders = MOCK_ADMINS.filter((a) => a.role === 'TRADER');

  return (
    <Sheet visible={visible} height="medium" onClose={onClose}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers.selectTrader')}</Text>
        {traders.map((trader) => (
          <Card
            key={trader.id}
            onPress={() => {
              onSelect(trader.id);
              onClose();
            }}
            accessibilityLabel={trader.name}
          >
            <Text style={[styles.name, { color: colors.ink }]}>{trader.name}</Text>
            <Text style={[styles.email, { color: colors.muted }]}>{trader.email}</Text>
          </Card>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm },
  title: { ...text.h2, marginBottom: space.sm },
  name: { ...text.bodySemi },
  email: { ...text.caption, marginTop: 2 },
});
