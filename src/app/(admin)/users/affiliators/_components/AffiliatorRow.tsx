import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Affiliator, AffiliatorRole } from '@/mocks/affiliators';

const ROLE_KEY: Record<AffiliatorRole, TranslationKey> = {
  OWNER: 'affiliators.roleOwner',
  MANAGER: 'affiliators.roleManager',
  STAFF: 'affiliators.roleStaff',
};

export interface AffiliatorRowProps {
  affiliator: Affiliator;
}

/** Avatar + name + restaurant + role badge + status. */
export function AffiliatorRow({ affiliator }: AffiliatorRowProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Card onPress={() => router.push(`/(admin)/users/restaurants/${affiliator.restaurantId}`)} accessibilityLabel={affiliator.name}>
      <View style={styles.header}>
        <Image source={{ uri: affiliator.imageUri }} style={styles.avatar} />
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{affiliator.name}</Text>
          <Text style={[styles.restaurant, { color: colors.muted }]}>{affiliator.restaurantName}</Text>
        </View>
        <Badge tone={affiliator.status === 'ACTIVE' ? 'leaf' : 'chili'} label={t(ROLE_KEY[affiliator.role])} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  restaurant: { ...text.caption, marginTop: 2 },
});
