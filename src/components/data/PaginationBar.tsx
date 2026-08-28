import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hit, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Prev/next pagination footer. Renders nothing when there's only one page. */
export function PaginationBar({ page, totalPages, onPrev, onNext }: PaginationBarProps) {
  const { colors } = useTheme();
  const t = useT();

  if (totalPages <= 1) return null;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrev}
        disabled={page <= 1}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.prevPage')}
        style={[styles.button, page <= 1 && styles.disabled]}
      >
        <Ionicons name="chevron-back" size={20} color={colors.ink} />
      </Pressable>
      <Text style={[styles.label, { color: colors.body }]}>
        {t('pagination.pageOfTotal', { page, total: totalPages })}
      </Text>
      <Pressable
        onPress={onNext}
        disabled={page >= totalPages}
        accessibilityRole="button"
        accessibilityLabel={t('a11y.nextPage')}
        style={[styles.button, page >= totalPages && styles.disabled]}
      >
        <Ionicons name="chevron-forward" size={20} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.lg,
    paddingVertical: space.md,
  },
  button: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.35 },
  label: { ...text.body },
});
