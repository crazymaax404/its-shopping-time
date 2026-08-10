import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalWrapper, Input, Select, Button, CurrencyInput } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { useUpdateListItem, useShoppingList } from '@/services/supabase/hooks';
import { CATEGORIES, UNITS, Category, Unit } from '@/types/supabase';
import { ShoppingListItem } from '@/types/supabase';

interface EditItemModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditItemModal({ visible, onClose }: EditItemModalProps) {
  const { editingItemId, setShowEditModal } = useUIStore();
  const { data: list } = useShoppingList();
  const updateItem = useUpdateListItem();

  const item = list?.find((i) => i.id === editingItemId);

  const [name, setName] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [unit, setUnit] = React.useState<Unit>('unidade');
  const [category, setCategory] = React.useState<Category>('Alimentos');
  const [notes, setNotes] = React.useState('');
  const [estimatedPrice, setEstimatedPrice] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnit(item.unit as Unit);
      setCategory(item.category);
      setNotes(item.notes || '');
      setEstimatedPrice(item.estimated_price || 0);
      setError('');
    }
  }, [item, editingItemId]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!editingItemId) return;

    setLoading(true);
    setError('');

    try {
      await updateItem.mutateAsync({
        id: editingItemId,
        updates: {
          name: name.trim(),
          quantity,
          unit,
          category,
          notes: notes || null,
          estimated_price: estimatedPrice > 0 ? estimatedPrice : null,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar item');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Editar Item">
      <View style={styles.form}>
        <Input
          label="Nome *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Leite"
          error={error}
          autoFocus
        />

        <View style={styles.row}>
          <Input
            label="Quantidade"
            value={quantity.toString()}
            onChangeText={(v) => setQuantity(parseInt(v) || 1)}
            keyboardType="numeric"
            style={styles.halfInput}
          />
          <Select
            label="Unidade"
            value={unit}
            onChange={setUnit}
            options={UNITS.map((u) => ({ label: u, value: u }))}
            style={styles.halfInput}
          />
        </View>

        <Select
          label="Categoria"
          value={category}
          onChange={setCategory}
          options={CATEGORIES.map((c) => ({ label: c, value: c }))}
        />

        <Input
          label="Observação"
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: Sem lactose"
          multiline
          numberOfLines={2}
        />

        <CurrencyInput
          label="Preço estimado (opcional)"
          value={estimatedPrice}
          onChange={setEstimatedPrice}
        />

        <View style={styles.buttonRow}>
          <Button
            title="Cancelar"
            variant="ghost"
            onPress={onClose}
          />
          <Button
            title="Salvar"
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            disabled={!name.trim()}
          />
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});