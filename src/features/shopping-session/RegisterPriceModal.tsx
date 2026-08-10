import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatBRL, parseBRL } from '@/utils/currency';
import { colors } from '@/theme';
import { Button } from '@/components/ui';

interface RegisterPriceModalProps {
  visible: boolean;
  itemName: string;
  unit: string;
  initialQuantity: number;
  initialTotalCents?: number;
  onClose: () => void;
  onConfirm: (quantity: number, totalCents: number) => void;
}

export function RegisterPriceModal({
  visible,
  itemName,
  unit,
  initialQuantity,
  initialTotalCents = 0,
  onClose,
  onConfirm,
}: RegisterPriceModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [totalText, setTotalText] = useState(
    initialTotalCents > 0 ? (initialTotalCents / 100).toString() : '',
  );

  useEffect(() => {
    if (visible) {
      setQuantity(initialQuantity);
      setTotalText(
        initialTotalCents > 0 ? (initialTotalCents / 100).toString() : '',
      );
    }
  }, [visible, initialQuantity, initialTotalCents]);

  const totalCents = useMemo(() => parseBRL(totalText), [totalText]);
  const unitPrice = quantity > 0 ? Math.round(totalCents / quantity) : 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{itemName}</Text>
              <Text style={styles.subtitle}>
                Registrar quantidade e preço pago
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Quantidade Comprada ({unit})
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.qtyValue}
              value={String(quantity)}
              onChangeText={(t) =>
                setQuantity(Math.max(1, parseInt(t, 10) || 1))
              }
              keyboardType="number-pad"
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Valor Total Pago (R$)</Text>
          <TextInput
            style={styles.totalInput}
            value={totalText}
            onChangeText={setTotalText}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.unitPriceBox}>
            <Text style={styles.unitPriceLabel}>
              Preço por {unit}:
            </Text>
            <Text style={styles.unitPriceValue}>{formatBRL(unitPrice)}</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Button
              title="Confirmar"
              onPress={() => onConfirm(quantity, totalCents)}
              fullWidth={false}
              style={styles.confirmBtn}
              disabled={totalCents <= 0}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  qtyValue: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  totalInput: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.primaryMuted,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 22,
    fontWeight: '700',
    color: colors.priceInput,
  },
  unitPriceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  unitPriceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  unitPriceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 8,
  },
  confirmBtn: {
    minWidth: 140,
    paddingHorizontal: 20,
  },
});
