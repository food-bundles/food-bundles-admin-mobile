import { useId, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  helper?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  rightSlot?: React.ReactNode;
}

/** Labelled text input with focus/error border states. Min height 48px. */
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  keyboardType,
  secureTextEntry,
  editable = true,
  maxLength,
  rightSlot,
}: InputProps) {
  const id = useId();
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.chili : focused ? colors.leaf : colors.hairline;

  return (
    <View>
      <Text style={[styles.label, { color: colors.ink }]} nativeID={id}>
        {label}
      </Text>
      <View
        style={[
          styles.row,
          { borderColor, backgroundColor: colors.paper },
          !editable && { backgroundColor: colors.neutral },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.muted}
          accessibilityLabel={label}
          accessibilityLabelledBy={id}
          style={[styles.input, { color: colors.ink }, !editable && { color: colors.muted }]}
        />
        {rightSlot}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: colors.chili }]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text style={[styles.helperText, { color: colors.muted }]}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, marginBottom: space.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  input: { ...text.body, flex: 1, paddingVertical: space.sm },
  errorText: { ...text.caption, marginTop: space.xs },
  helperText: { ...text.caption, marginTop: space.xs },
});
