import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

/** Dashboard / list-header metric tile. 2-column grid on phone. */
export function StatCard({ label, value, delta, icon, onPress }: StatCardProps) {
  const { colors } = useTheme();
  const isPositive = delta ? !delta.trim().startsWith('-') : true;

  return (
    <Card onPress={onPress} accessibilityLabel={onPress ? `${label}: ${value}` : undefined}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
      {delta ? (
        <Text style={[styles.delta, { color: isPositive ? colors.ripe : colors.chili }]}>{delta}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...text.label },
  value: { ...text.priceLg, marginTop: space.xs },
  delta: { ...text.caption, marginTop: space.xs },
});
