import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily } from '@/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps<T extends string = string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: any;
  dark?: boolean;
}

export function Select<T extends string = string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecionar',
  error,
  disabled = false,
  style,
  dark = false,
}: SelectProps<T>) {
  const [showModal, setShowModal] = React.useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.select,
          dark && styles.selectDark,
          error && styles.selectError,
          disabled && styles.selectDisabled,
        ]}
        onPress={() => !disabled && setShowModal(true)}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.selectText,
            dark && styles.selectTextDark,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={dark ? colors.textOnDarkMuted : colors.textMuted}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={showModal} animationType="slide" transparent>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={styles.modalOverlay}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Selecionar'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    option.value === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onChange(option.value as T);
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  selectDark: {
    backgroundColor: colors.navySoft,
    borderColor: 'transparent',
  },
  selectError: {
    borderColor: colors.danger,
  },
  selectDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectTextDark: {
    color: colors.textOnDark,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionSelected: {
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
  },
});
