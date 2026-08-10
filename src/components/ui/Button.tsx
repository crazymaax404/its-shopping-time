import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const baseStyle = {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: fullWidth ? '100%' : 'auto',
    paddingHorizontal: 16,
    ...style,
  };

  const variantStyles = {
    primary: { backgroundColor: '#2E7D32' },
    secondary: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#2E7D32' },
    danger: { backgroundColor: '#C62828' },
    ghost: { backgroundColor: 'transparent' },
  };

  const textStyles = {
    primary: { color: '#fff', fontWeight: '600' },
    secondary: { color: '#2E7D32', fontWeight: '600' },
    danger: { color: '#fff', fontWeight: '600' },
    ghost: { color: '#2E7D32', fontWeight: '600' },
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[baseStyle, variantStyles[variant], isDisabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={{ width: 20, height: 20 }}>
          <Text style={{ color: variant === 'ghost' ? '#2E7D32' : '#fff' }}>⏳</Text>
        </View>
      ) : (
        <Text style={[textStyles[variant], { fontSize: 16 }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}