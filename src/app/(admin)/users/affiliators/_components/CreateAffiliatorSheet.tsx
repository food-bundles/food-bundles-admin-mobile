import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { FilterBar, type FilterChip } from '@/components/data/FilterBar';
import { MOCK_RESTAURANTS } from '@/mocks/restaurants';
import type { Affiliator, AffiliatorRole } from '@/mocks/affiliators';

const ROLE_KEY: Record<AffiliatorRole, TranslationKey> = {
  OWNER: 'affiliators.roleOwner',
  MANAGER: 'affiliators.roleManager',
  STAFF: 'affiliators.roleStaff',
};
const ROLES: AffiliatorRole[] = ['OWNER', 'MANAGER', 'STAFF'];

export interface CreateAffiliatorSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (affiliator: Affiliator) => void;
}

/**
 * Full create-affiliator form: name, email, phone, role, restaurant search
 * + select, image upload. Matches the restaurant app's add-affiliator flow
 * shape, but scoped to the platform-wide Affiliators list (Section 6 gap:
 * the list previously had no way to add an affiliator at all).
 */
export function CreateAffiliatorSheet({ visible, onClose, onCreate }: CreateAffiliatorSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AffiliatorRole>('STAFF');
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const query = restaurantSearch.trim().toLowerCase();
  const matches = query ? MOCK_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(query)) : MOCK_RESTAURANTS.slice(0, 8);
  const restaurantChips: FilterChip[] = matches.map((r) => ({ key: r.id, label: r.name }));
  const selectedRestaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('STAFF');
    setRestaurantSearch('');
    setRestaurantId(null);
    setImageUri(null);
  };

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && restaurantId !== null;

  const handleSubmit = () => {
    if (!canSubmit || !selectedRestaurant) return;
    onCreate({
      id: `aff-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      imageUri: imageUri ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(email.trim())}`,
    });
    reset();
    onClose();
  };

  return (
    <Sheet
      visible={visible}
      height="tall"
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('affiliators.createTitle')}</Text>
        <ImageUpload uri={imageUri} onChange={setImageUri} shape="circle" size={80} accessibilityLabel={name || t('affiliators.createTitle')} />
        <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
        <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label={t('restaurants.fieldPhone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <View>
          <Text style={[styles.label, { color: colors.ink }]}>{t('affiliators.fieldRole')}</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => {
              const active = r === role;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  accessibilityRole="button"
                  accessibilityLabel={t(ROLE_KEY[r])}
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.roleChip,
                    active ? { backgroundColor: colors.leaf } : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.hairline },
                  ]}
                >
                  <Text style={[text.label, { color: active ? colors.paper : colors.body }]}>{t(ROLE_KEY[r])}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Input
          label={t('affiliators.fieldRestaurant')}
          value={restaurantSearch}
          onChangeText={setRestaurantSearch}
          placeholder={t('affiliators.fieldRestaurantSearch')}
        />
        <FilterBar chips={restaurantChips} activeKey={restaurantId} onSelect={setRestaurantId} />
        {!restaurantId ? <Text style={[styles.hint, { color: colors.muted }]}>{t('affiliators.selectRestaurantFirst')}</Text> : null}

        <Button variant="primary" fullWidth disabled={!canSubmit} onPress={handleSubmit} accessibilityLabel={t('affiliators.create')}>
          {t('common.save')}
        </Button>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md, alignItems: 'center' },
  title: { ...text.h2 },
  label: { ...text.label, marginBottom: space.xs, alignSelf: 'flex-start' },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  roleChip: { minHeight: hit.min, borderRadius: radius.pill, paddingHorizontal: space.md, alignItems: 'center', justifyContent: 'center' },
  hint: { ...text.caption, alignSelf: 'flex-start' },
});
