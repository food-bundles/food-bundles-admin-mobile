import { Modal, StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Button } from '@/components/ui/Button';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

/** Single shared destructive-action confirmation, used everywhere instead of per-screen duplicates. */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, shadow.elevated, { backgroundColor: colors.paper }]}>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
          <View style={styles.actions}>
            <View style={styles.actionSlot}>
              <Button variant="ghost" onPress={onCancel}>
                {t('common.cancel')}
              </Button>
            </View>
            <View style={styles.actionSlot}>
              <Button variant={variant === 'danger' ? 'destructive' : 'primary'} onPress={onConfirm}>
                {confirmLabel}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  card: { borderRadius: radius.lg, padding: space.lg, width: '100%', maxWidth: 360 },
  title: { ...text.h2 },
  message: { ...text.body, marginTop: space.sm },
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  actionSlot: { flex: 1 },
});
