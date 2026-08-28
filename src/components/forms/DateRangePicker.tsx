import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';

export interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
  fromLabel: string;
  toLabel: string;
  doneLabel: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/** From/To date pickers, side by side. iOS shows a modal picker, Android inline. */
export function DateRangePicker({ from, to, onChange, fromLabel, toLabel, doneLabel }: DateRangePickerProps) {
  const { colors } = useTheme();
  const [openField, setOpenField] = useState<'from' | 'to' | null>(null);
  const [draft, setDraft] = useState<Date | undefined>(undefined);

  const showPicker = (field: 'from' | 'to') => {
    setDraft(field === 'from' ? from : to);
    setOpenField(field);
  };

  const commit = (field: 'from' | 'to', selected: Date) => {
    onChange(field === 'from' ? { from: selected, to } : { from, to: selected });
  };

  const handleChange = (field: 'from' | 'to', selected: Date | undefined) => {
    if (!selected) return;
    if (Platform.OS === 'android') {
      setOpenField(null);
      commit(field, selected);
    } else {
      setDraft(selected);
    }
  };

  const closeIosModal = () => {
    if (openField && draft) commit(openField, draft);
    setOpenField(null);
  };

  return (
    <View style={styles.row}>
      <View style={styles.slot}>
        <Text style={[styles.label, { color: colors.ink }]}>{fromLabel}</Text>
        <Pressable
          onPress={() => showPicker('from')}
          accessibilityRole="button"
          accessibilityLabel={`${fromLabel}: ${formatDate(from)}`}
          style={[styles.field, { borderColor: colors.hairline }]}
        >
          <Text style={{ color: colors.ink }}>{formatDate(from)}</Text>
        </Pressable>
      </View>
      <View style={styles.slot}>
        <Text style={[styles.label, { color: colors.ink }]}>{toLabel}</Text>
        <Pressable
          onPress={() => showPicker('to')}
          accessibilityRole="button"
          accessibilityLabel={`${toLabel}: ${formatDate(to)}`}
          style={[styles.field, { borderColor: colors.hairline }]}
        >
          <Text style={{ color: colors.ink }}>{formatDate(to)}</Text>
        </Pressable>
      </View>

      {openField && Platform.OS === 'android' ? (
        <DateTimePicker value={openField === 'from' ? from : to} mode="date" display="default" onChange={(_e, selected) => handleChange(openField, selected)} />
      ) : null}

      {openField && Platform.OS === 'ios' ? (
        <Modal visible transparent animationType="fade" onRequestClose={closeIosModal}>
          <View style={styles.backdrop}>
            <View style={[styles.iosCard, shadow.elevated, { backgroundColor: colors.paper }]}>
              <DateTimePicker
                value={draft ?? (openField === 'from' ? from : to)}
                mode="date"
                display="spinner"
                onChange={(_e, selected) => handleChange(openField, selected)}
              />
              <Pressable onPress={closeIosModal} accessibilityRole="button" accessibilityLabel={doneLabel} style={styles.doneButton}>
                <Text style={[styles.doneLabel, { color: colors.leaf }]}>{doneLabel}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md },
  slot: { flex: 1 },
  label: { ...text.label, marginBottom: space.xs },
  field: {
    minHeight: hit.min,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  iosCard: { borderRadius: radius.lg, padding: space.md },
  doneButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  doneLabel: { ...text.bodySemi },
});
