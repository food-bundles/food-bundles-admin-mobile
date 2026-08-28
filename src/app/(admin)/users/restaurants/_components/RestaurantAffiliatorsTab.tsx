import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_AFFILIATORS, type Affiliator, type AffiliatorRole } from '@/mocks/affiliators';
import { AddAffiliatorSheet } from './AddAffiliatorSheet';

const ROLE_KEY: Record<AffiliatorRole, TranslationKey> = {
  OWNER: 'affiliators.roleOwner',
  MANAGER: 'affiliators.roleManager',
  STAFF: 'affiliators.roleStaff',
};

export interface RestaurantAffiliatorsTabProps {
  restaurantId: string;
  restaurantName: string;
}

/** Staff list with role badges + "Add affiliator" sheet (local-only, no persistence). */
export function RestaurantAffiliatorsTab({ restaurantId, restaurantName }: RestaurantAffiliatorsTabProps) {
  const { colors } = useTheme();
  const t = useT();
  const [added, setAdded] = useState<Affiliator[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const affiliators = [...MOCK_AFFILIATORS.filter((a) => a.restaurantId === restaurantId), ...added];

  return (
    <View style={styles.container}>
      {affiliators.length === 0 ? (
        <EmptyState icon={null} title={t('restaurants.noAffiliators')} message={t('restaurants.noAffiliators')} />
      ) : (
        <Card>
          {affiliators.map((affiliator, index) => (
            <View key={affiliator.id} style={[styles.row, index < affiliators.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.hairline }]}>
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{affiliator.name}</Text>
                <Text style={[styles.email, { color: colors.muted }]}>{affiliator.email}</Text>
              </View>
              <Badge tone={affiliator.status === 'ACTIVE' ? 'leaf' : 'chili'} label={t(ROLE_KEY[affiliator.role])} />
            </View>
          ))}
        </Card>
      )}
      <Button variant="secondary" fullWidth onPress={() => setSheetOpen(true)}>
        {t('restaurants.addAffiliator')}
      </Button>
      <AddAffiliatorSheet
        visible={sheetOpen}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        onClose={() => setSheetOpen(false)}
        onAdd={(affiliator) => setAdded((prev) => [...prev, affiliator])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  email: { ...text.caption, marginTop: 2 },
});
