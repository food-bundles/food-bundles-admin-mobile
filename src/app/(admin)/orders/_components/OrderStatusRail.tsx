import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { OrderStatus } from '@/mocks/orders';
import { ORDER_STEPS, STATUS_KEY, isTerminalNonHappy, stepIndex } from './orderSteps';

export interface OrderStatusRailProps {
  status: OrderStatus;
}

/** Horizontal step rail, auto-scrolled so the current step is visible. */
export function OrderStatusRail({ status }: OrderStatusRailProps) {
  const { colors } = useTheme();
  const t = useT();
  const scrollRef = useRef<ScrollView>(null);
  const currentIndex = isTerminalNonHappy(status) ? ORDER_STEPS.length : stepIndex(status);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: Math.max(0, currentIndex - 1) * 96, animated: true });
  }, [currentIndex]);

  return (
    <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ORDER_STEPS.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <View key={step} style={styles.step}>
            <View style={[styles.dot, { backgroundColor: done ? colors.leaf : colors.hairline }]} />
            <Text style={[styles.label, { color: done ? colors.ink : colors.muted }]}>{t(STATUS_KEY[step])}</Text>
          </View>
        );
      })}
      {isTerminalNonHappy(status) ? (
        <View style={styles.step}>
          <View style={[styles.dot, { backgroundColor: colors.chili }]} />
          <Text style={[styles.label, { color: colors.chili }]}>{t(STATUS_KEY[status])}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: space.lg, gap: space.lg },
  step: { width: 80, alignItems: 'center', gap: space.xs },
  dot: { width: 12, height: 12, borderRadius: 6 },
  label: { ...text.micro, textAlign: 'center' },
});
