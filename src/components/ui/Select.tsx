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
}: SelectProps<T>) {
  const [showModal, setShowModal] = React.useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.select,
          error && styles.selectError,
          disabled && styles.selectDisabled,
        ]}
        onPress={() => !disabled && setShowModal(true)}
        activeOpacity={0.9}
      >
        <Text
          style={[styles.selectText, !selectedOption && styles.placeholderText]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={24} color="#9E9E9E" />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Selecionar'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#212121" />
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
                    <Ionicons name="checkmark" size={20} color="#2E7D32" />
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
    color: '#424242',
  },
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  selectError: {
    borderColor: '#C62828',
  },
  selectDisabled: {
    backgroundColor: '#F5F5F5',
  },
  selectText: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionSelected: {
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
  },
  optionTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});
