import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { LookupResult } from './lookupSearch';

const KIND_KEY: Record<LookupResult['kind'], TranslationKey> = {
  restaurant: 'lookup.roleRestaurant',
  farmer: 'lookup.roleFarmer',
  affiliator: 'lookup.roleAffiliator',
  admin: 'lookup.roleAdmin',
};

const KIND_ROUTE: Record<LookupResult['kind'], (id: string) => string> = {
  restaurant: (id) => `/(admin)/users/restaurants/${id}`,
  farmer: (id) => `/(admin)/users/farmers/${id}`,
  affiliator: (id) => `/(admin)/users/affiliators/${id}`,
  admin: (id) => `/(admin)/users/admins/${id}`,
};

function nameOf(result: LookupResult): string {
  return result.record.name;
}

function emailOf(result: LookupResult): string | undefined {
  return 'email' in result.record ? result.record.email : undefined;
}

export interface LookupResultCardProps {
  result: LookupResult;
}

/** One matched user, tappable through to its own detail screen. */
export function LookupResultCard({ result }: LookupResultCardProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Card onPress={() => router.push(KIND_ROUTE[result.kind](result.record.id) as never)} accessibilityLabel={nameOf(result)}>
      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{nameOf(result)}</Text>
          {emailOf(result) ? <Text style={[styles.email, { color: colors.muted }]}>{emailOf(result)}</Text> : null}
        </View>
        <Badge tone="leaf" label={t(KIND_KEY[result.kind])} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  email: { ...text.caption, marginTop: 2 },
});
