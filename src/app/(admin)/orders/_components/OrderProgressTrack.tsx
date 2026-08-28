import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import type { OrderStatus } from '@/mocks/orders';
import { ORDER_STEPS, isTerminalNonHappy, stepIndex } from './orderSteps';

export interface OrderProgressTrackProps {
  status: OrderStatus;
}

/** Compact dot track for list rows — one dot per happy-path step, filled up to the current one. */
export function OrderProgressTrack({ status }: OrderProgressTrackProps) {
  const { colors } = useTheme();
  const currentIndex = isTerminalNonHappy(status) ? -1 : stepIndex(status);
  const dotColor = status === 'CANCELLED' || status === 'REFUNDED' ? colors.chili : colors.leaf;

  return (
    <View style={styles.row}>
      {ORDER_STEPS.map((step, index) => (
        <View
          key={step}
          style={[
            styles.dot,
            { backgroundColor: index <= currentIndex ? dotColor : colors.hairline },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
});
