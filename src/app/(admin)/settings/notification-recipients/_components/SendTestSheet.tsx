import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Sheet } from '@/components/modals/Sheet';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { NotificationChannel } from '@/mocks/notifications';

export interface SendTestSheetProps {
  visible: boolean;
  defaultChannel: NotificationChannel;
  onClose: () => void;
  onSend: (body: string) => void;
}

/** Compose sheet: TextInput → mock "sends" → confirmation toast, appends to history via onSend. */
export function SendTestSheet({ visible, onClose, onSend }: SendTestSheetProps) {
  const { colors } = useTheme();
  const t = useT();
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const handleClose = () => {
    setBody('');
    setSent(false);
    onClose();
  };

  const handleSend = () => {
    if (!body.trim()) return;
    onSend(body.trim());
    setSent(true);
  };

  return (
    <Sheet visible={visible} height="medium" onClose={handleClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('settings.sendTestNotification')}</Text>
        {sent ? (
          <Text style={[styles.success, { color: colors.ripe }]}>{t('settings.testSentConfirm')}</Text>
        ) : (
          <>
            <Input label={t('settings.messageBody')} value={body} onChangeText={setBody} />
            <Button variant="primary" fullWidth onPress={handleSend}>
              {t('settings.sendTestNotification')}
            </Button>
          </>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h2, marginBottom: space.md },
  success: { ...text.bodySemi },
});
