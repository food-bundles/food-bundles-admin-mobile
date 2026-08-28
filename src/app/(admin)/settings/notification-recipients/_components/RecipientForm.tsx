import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT, type TranslationKey } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { NotificationChannel } from '@/mocks/notifications';
import type { NotificationRecipient } from '@/mocks/notification-recipients';

const CHANNELS: NotificationChannel[] = ['orders', 'vouchers', 'submissions', 'stock', 'system', 'users'];
const CHANNEL_KEY: Record<NotificationChannel, TranslationKey> = {
  orders: 'settings.channelOrders',
  vouchers: 'settings.channelVouchers',
  submissions: 'settings.channelSubmissions',
  stock: 'settings.channelStock',
  system: 'settings.channelSystem',
  users: 'settings.channelUsers',
};

export interface RecipientFormValues {
  name: string;
  email: string;
  channels: NotificationChannel[];
  active: boolean;
}

export interface RecipientFormProps {
  initial?: NotificationRecipient;
  onSubmit: (values: RecipientFormValues) => void;
  submitLabel: string;
}

/** Name, email, multi-select channel chips, active toggle. Shared by create and edit. */
export function RecipientForm({ initial, onSubmit, submitLabel }: RecipientFormProps) {
  const { colors } = useTheme();
  const t = useT();
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [channels, setChannels] = useState<NotificationChannel[]>(initial?.channels ?? []);
  const [active, setActive] = useState(initial?.active ?? true);

  const toggleChannel = (channel: NotificationChannel) => {
    setChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), channels, active });
  };

  return (
    <View style={styles.container}>
      <Input label={t('restaurants.fieldName')} value={name} onChangeText={setName} />
      <Input label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={[styles.label, { color: colors.ink }]}>{t('settings.fieldChannels')}</Text>
      <View style={styles.chipRow}>
        {CHANNELS.map((channel) => {
          const isActive = channels.includes(channel);
          return (
            <Pressable
              key={channel}
              onPress={() => toggleChannel(channel)}
              accessibilityRole="button"
              accessibilityLabel={t(CHANNEL_KEY[channel])}
              accessibilityState={{ selected: isActive }}
              style={[styles.chip, { backgroundColor: isActive ? colors.leaf : 'transparent', borderColor: colors.hairline }]}
            >
              <Text style={[text.label, { color: isActive ? colors.paper : colors.body }]}>{t(CHANNEL_KEY[channel])}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => setActive((prev) => !prev)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: active }}
        accessibilityLabel={t('settings.fieldActive')}
        style={styles.toggleRow}
      >
        <Text style={[text.body, { color: colors.ink }]}>{t('settings.fieldActive')}</Text>
        <View style={[styles.toggleDot, { backgroundColor: active ? colors.leaf : colors.hairline }]} />
      </Pressable>

      <Button variant="primary" fullWidth onPress={handleSubmit}>
        {submitLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.md },
  label: { ...text.label },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { minHeight: hit.min, paddingHorizontal: space.md, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: hit.min },
  toggleDot: { width: 20, height: 20, borderRadius: 10 },
});
