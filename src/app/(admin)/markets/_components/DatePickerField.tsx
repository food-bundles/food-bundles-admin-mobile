import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useLanguageStore } from '@/i18n';
import { formatDate } from '@/lib/date';

export interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

/** Single-field date picker: iOS shows a modal spinner, Android shows the inline native picker. */
export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguageStore((state) => state.language);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | undefined>(undefined);

  const handleChange = (selected: Date | undefined) => {
    if (!selected) return;
    if (Platform.OS === 'android') {
      setOpen(false);
      onChange(selected);
    } else {
      setDraft(selected);
    }
  };

  const closeIosModal = () => {
    if (draft) onChange(draft);
    setOpen(false);
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.ink }]}>{label}</Text>
      <Pressable
        onPress={() => {
          setDraft(value);
          setOpen(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value.toISOString(), language)}`}
        style={[styles.field, { borderColor: colors.hairline }]}
      >
        <Text style={{ color: colors.ink }}>{formatDate(value.toISOString(), language)}</Text>
      </Pressable>

      {open && Platform.OS === 'android' ? (
        <DateTimePicker value={value} mode="date" display="default" onChange={(_e, selected) => handleChange(selected)} />
      ) : null}

      {open && Platform.OS === 'ios' ? (
        <Modal visible transparent animationType="fade" onRequestClose={closeIosModal}>
          <View style={styles.backdrop}>
            <View style={[styles.iosCard, shadow.elevated, { backgroundColor: colors.paper }]}>
              <DateTimePicker value={draft ?? value} mode="date" display="spinner" onChange={(_e, selected) => handleChange(selected)} />
              <Pressable onPress={closeIosModal} accessibilityRole="button" accessibilityLabel={t('common.confirm')} style={styles.doneButton}>
                <Text style={[styles.doneLabel, { color: colors.leaf }]}>{t('common.confirm')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, marginBottom: space.xs },
  field: { minHeight: hit.min, justifyContent: 'center', borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  iosCard: { borderRadius: radius.lg, padding: space.md },
  doneButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  doneLabel: { ...text.bodySemi },
});
