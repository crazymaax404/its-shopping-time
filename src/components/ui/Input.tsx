import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, fontFamily } from '@/theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  textAlign?: 'left' | 'center' | 'right';
  inputStyle?: any;
  autoFocus?: boolean;
  dark?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  multiline = false,
  numberOfLines,
  textAlign = 'left',
  inputStyle,
  autoFocus = false,
  dark = false,
  autoCapitalize,
  autoComplete,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          dark && styles.inputDark,
          { textAlign },
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={dark ? colors.textOnDarkMuted : colors.textMuted}
        editable={!disabled}
        pointerEvents={disabled ? 'none' : 'auto'}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: fontFamily.medium,
    color: colors.textSecondary,
  },
  labelDark: {
    color: colors.textOnDark,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.navySoft,
    borderColor: 'transparent',
    color: colors.textOnDark,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceAlt,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
});
