import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { SUGGESTED_QUESTIONS } from '@/lib/opsAssistantReplies';

export interface SuggestedQuestionsProps {
  onSelect: (label: string) => void;
}

/** Horizontal quick-reply chip row above the composer, so admins can tap a common ops question. */
export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {SUGGESTED_QUESTIONS.map((q) => {
        const label = t(q.labelKey);
        return (
          <Pressable
            key={q.id}
            onPress={() => onSelect(label)}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={[styles.chip, { borderColor: colors.leaf, backgroundColor: colors.tintLeaf }]}
          >
            <Text style={[text.caption, { color: colors.leaf }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg, paddingBottom: space.sm },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: space.xs, minHeight: 36, justifyContent: 'center' },
});
