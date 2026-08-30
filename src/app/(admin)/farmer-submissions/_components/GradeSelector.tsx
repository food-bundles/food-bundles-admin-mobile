import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { SubmissionGrade } from '@/stores/farmerSubmissionsStore';

const GRADES: SubmissionGrade[] = ['A', 'B', 'C', 'REJECTED'];

export interface GradeSelectorProps {
  value: SubmissionGrade;
  onChange: (grade: SubmissionGrade) => void;
}

/** Quality grade selector (A/B/C/Rejected) the admin sets when approving a submission. */
export function GradeSelector({ value, onChange }: GradeSelectorProps) {
  const { colors } = useTheme();
  const t = useT();

  return (
    <View>
      <Text style={[styles.label, { color: colors.ink }]}>{t('farmerSubmissions.gradeLabel')}</Text>
      <View style={styles.row}>
        {GRADES.map((grade) => {
          const active = grade === value;
          return (
            <Pressable
              key={grade}
              onPress={() => onChange(grade)}
              accessibilityRole="button"
              accessibilityLabel={t('farmerSubmissions.gradeLabel') + ' ' + grade}
              accessibilityState={{ selected: active }}
              style={[
                styles.chip,
                { borderColor: colors.hairline },
                active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
              ]}
            >
              <Text style={[styles.chipLabel, { color: active ? colors.paper : colors.body }]}>{grade}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, marginBottom: space.xs },
  row: { flexDirection: 'row', gap: space.sm },
  chip: {
    minWidth: hit.min,
    minHeight: hit.min - 8,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { ...text.bodySemi },
});
