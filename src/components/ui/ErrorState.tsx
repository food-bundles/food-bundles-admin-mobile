import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { Button } from './Button';

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Chili alert icon + message + retry button. Used for failed list/detail fetches. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintChili }]}>
        <Ionicons name="alert-circle" size={24} color={colors.chili} />
      </View>
      <Text style={[styles.title, { color: colors.ink }]}>{t('common.error')}</Text>
      <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
      <View style={styles.action}>
        <Button variant="secondary" size="sm" onPress={onRetry}>
          {t('common.retry')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: space.xl },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...text.h2, marginTop: space.md, textAlign: 'center' },
  message: { ...text.caption, marginTop: space.xs, textAlign: 'center' },
  action: { marginTop: space.lg },
});
