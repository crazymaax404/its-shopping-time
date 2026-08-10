import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useProducts,
  useAddProduct,
  useAddListItem,
} from '@/services/supabase/hooks';
import { UNITS, Unit, ShoppingListItemInsert } from '@/types/supabase';
import { parseBRL } from '@/utils/currency';
import { colors } from '@/theme';
import { Select } from './Select';

export function QuickAddCard() {
  const { data: products } = useProducts();
  const addProduct = useAddProduct();
  const addListItem = useAddListItem();

  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<Unit>('unidade');
  const [priceText, setPriceText] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName('');
    setQuantity('1');
    setUnit('unidade');
    setPriceText('');
    setNotes('');
    setExpanded(false);
  };

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nome obrigatório', 'Digite o que acabou no mercado');
      return;
    }

    setLoading(true);
    try {
      const qty = Math.max(1, parseInt(quantity, 10) || 1);
      const estimated = priceText ? parseBRL(priceText) : 0;
      let productId: string | undefined;

      const existing = products?.find(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) {
        productId = existing.id;
      } else {
        const created = await addProduct.mutateAsync({
          name: trimmed,
          category: 'Alimentos',
          default_unit: unit,
          default_quantity: qty,
          notes: notes || null,
        });
        productId = created.id;
      }

      const item: ShoppingListItemInsert = {
        product_id: productId,
        name: trimmed,
        quantity: qty,
        unit,
        estimated_price: estimated > 0 ? estimated : null,
        category: existing?.category ?? 'Alimentos',
        notes: notes || null,
      };

      await addListItem.mutateAsync(item);
      reset();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao adicionar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>ADICIONAR RÁPIDO</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.nameField}
          activeOpacity={0.9}
          onPress={() => setExpanded(true)}
        >
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (!expanded) setExpanded(true);
            }}
            onFocus={() => setExpanded(true)}
            placeholder="O que acabou no mercado?"
            placeholderTextColor={colors.textOnDarkMuted}
          />
          <TouchableOpacity onPress={() => setExpanded((v) => !v)} hitSlop={8}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textOnDarkMuted}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, loading && { opacity: 0.6 }]}
          onPress={handleAdd}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.expanded}>
          <Text style={styles.fieldLabel}>Qtd. & Unidade</Text>
          <View style={styles.qtyRow}>
            <TextInput
              style={[styles.darkInput, styles.qtyInput]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
            />
            <Select
              value={unit}
              onChange={setUnit}
              options={UNITS.map((u) => ({ label: u, value: u }))}
              dark
              style={styles.unitSelect}
            />
          </View>

          <Text style={styles.fieldLabel}>Preço est. (R$)</Text>
          <TextInput
            style={styles.darkInput}
            value={priceText}
            onChangeText={setPriceText}
            placeholder="Ex: 18.50"
            placeholderTextColor={colors.textOnDarkMuted}
            keyboardType="decimal-pad"
          />

          <Text style={styles.fieldLabel}>Observação</Text>
          <TextInput
            style={styles.darkInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Sem lactose, marca Tio João"
            placeholderTextColor={colors.textOnDarkMuted}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  title: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  nameField: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.navySoft,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    color: colors.textOnDark,
    fontSize: 15,
    paddingVertical: 0,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expanded: {
    gap: 8,
  },
  fieldLabel: {
    color: colors.textOnDark,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  darkInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.navySoft,
    paddingHorizontal: 14,
    color: colors.textOnDark,
    fontSize: 15,
  },
  qtyInput: {
    width: 72,
    textAlign: 'center',
  },
  unitSelect: {
    flex: 1,
  },
});
