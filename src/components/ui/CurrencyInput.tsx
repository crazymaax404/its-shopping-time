import React from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';
import { parseBRL, formatBRLInput } from '@/utils/currency';

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (cents: number) => void;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = 'R$ 0,00',
  style,
  disabled = false,
}: CurrencyInputProps) {
  const [text, setText] = React.useState(formatBRLInput(value));

  React.useEffect(() => {
    setText(formatBRLInput(value));
  }, [value]);

  const handleChange = (newText: string) => {
    const formatted = newText.replace(/[^\d]/g, '').replace(/^0+/, '');

    let displayText = '';
    if (formatted.length === 0) {
      displayText = '';
    } else if (formatted.length === 1) {
      displayText = `0,0${formatted}`;
    } else if (formatted.length === 2) {
      displayText = `0,${formatted}`;
    } else {
      displayText = formatted.slice(0, -2) + ',' + formatted.slice(-2);
    }

    setText(displayText);

    const cents = parseBRL(displayText);
    onChange(cents);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        value={text}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        keyboardType="numeric"
        textAlign="right"
        editable={!disabled}
      />
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
    fontSize: 18,
    fontFamily: 'monospace',
    backgroundColor: '#FAFAFA',
    color: '#212121',
  },
});
