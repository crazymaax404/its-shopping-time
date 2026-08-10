import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  ModalWrapper,
  Input,
  Select,
  Button,
  CurrencyInput,
} from "@/components/ui";
import { useProducts, useAddProduct } from "@/services/supabase/hooks";
import { useAddListItem } from "@/services/supabase/hooks";
import { useUIStore } from "@/stores/uiStore";
import { CATEGORIES, UNITS, Category, Unit } from "@/types/supabase";
import { ShoppingListItemInsert } from "@/types/supabase";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialName?: string;
}

export function AddItemModal({
  visible,
  onClose,
  onSuccess,
  initialName,
}: AddItemModalProps) {
  const { setShowAddModal } = useUIStore();
  const { data: products } = useProducts();
  const { data: searchResults } = useSearchProducts("");
  const addListItem = useAddListItem();
  const addProduct = useAddProduct();

  const [name, setName] = useState(initialName || "");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>("unidade");
  const [category, setCategory] = useState<Category>("Alimentos");
  const [notes, setNotes] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialName || "");
    setQuantity(1);
    setUnit("unidade");
    setCategory("Alimentos");
    setNotes("");
    setEstimatedPrice(0);
    setSelectedProduct(null);
    setError("");
  }, [visible, initialName]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let productId: string | undefined;

      if (selectedProduct) {
        productId = selectedProduct.id;
      } else {
        const existingProduct = products?.find(
          (p) => p.name.toLowerCase() === name.toLowerCase().trim(),
        );
        if (!existingProduct) {
          const newProduct = await addProduct.mutateAsync({
            name: name.trim(),
            category,
            default_unit: unit,
            default_quantity: quantity,
            notes: notes || null,
          });
          productId = newProduct.id;
        } else {
          productId = existingProduct.id;
        }
      }

      const item: ShoppingListItemInsert = {
        product_id: productId,
        name: name.trim(),
        quantity,
        unit,
        estimated_price: estimatedPrice > 0 ? estimatedPrice : null,
        category,
        notes: notes || null,
      };

      await addListItem.mutateAsync(item);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar item");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async () => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let productId: string | undefined;

      const existingProduct = products?.find(
        (p) => p.name.toLowerCase() === name.toLowerCase().trim(),
      );
      if (existingProduct) {
        productId = existingProduct.id;
      }

      const item: ShoppingListItemInsert = {
        product_id: productId,
        name: name.trim(),
        quantity: 1,
        unit: "unidade",
        estimated_price: null,
        category: "Alimentos",
        notes: null,
      };

      await addListItem.mutateAsync(item);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar item");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setName(product.name);
    setQuantity(product.default_quantity);
    setUnit(product.default_unit);
    setCategory(product.category);
    setNotes(product.notes || "");
    setShowProductPicker(false);
    Keyboard.dismiss();
  };

  const filteredProducts =
    products?.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    ) ?? [];

  return (
    <ModalWrapper visible={visible} onClose={onClose} title="Adicionar Item">
      <View style={styles.form}>
        <Input
          label="Nome *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Leite"
          error={error}
          autoFocus
        />

        {name.length >= 2 && filteredProducts.length > 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Sugestões:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {filteredProducts.slice(0, 5).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.suggestionChip}
                  onPress={() => handleProductSelect(product)}
                >
                  <Text style={styles.suggestionChipText}>{product.name}</Text>
                  <Text style={styles.suggestionChipDetail}>
                    {product.default_quantity} {product.default_unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
            title="Adicionar Rápido"
            variant="secondary"
            onPress={handleQuickAdd}
            loading={loading}
            disabled={!name.trim()}
          />
          <Button
            title="Adicionar Completo"
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
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  suggestions: {
    gap: 8,
  },
  suggestionsLabel: {
    fontSize: 13,
    color: "#757575",
  },
  suggestionChip: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  suggestionChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2E7D32",
  },
  suggestionChipDetail: {
    fontSize: 12,
    color: "#4CAF50",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});
