import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  secureTextEntry?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  textAlign?: 'left' | 'center' | 'right';
  inputStyle?: any;
  autoFocus?: boolean;
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
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { textAlign },
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        editable={!disabled}
        pointerEvents={disabled ? 'none' : 'auto'}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoFocus={autoFocus}
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
    color: '#424242',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#212121',
  },
  inputError: {
    borderColor: '#C62828',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#9E9E9E',
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
  },
});
