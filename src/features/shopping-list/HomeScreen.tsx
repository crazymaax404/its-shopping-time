import { useMemo } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import {
  useShoppingList,
  useDeleteListItem,
  useUpdateListItem,
} from "@/services/supabase/hooks";
import { useStartPurchase } from "@/services/supabase/hooks";
import { useUIStore } from "@/stores/uiStore";
import { AddItemModal } from "./AddItemModal";
import { EditItemModal } from "./EditItemModal";
import { ListItem, Button } from "@/components/ui";
import { formatBRL } from "@/utils/currency";
import { CATEGORIES, ShoppingListItem } from "@/types/supabase";
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data: list, isLoading, refetch } = useShoppingList();
  const {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    editingItemId,
  } = useUIStore();
  const deleteItem = useDeleteListItem();
  const updateItem = useUpdateListItem();
  const startPurchase = useStartPurchase();

  const groupedItems = useMemo(() => {
    if (!list || !Array.isArray(list) || list.length === 0) return [];
    const validItems = list.filter(
      (item): item is ShoppingListItem =>
        !!item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.category === "string" &&
        item.category.length > 0,
    );
    const groups: Record<string, ShoppingListItem[]> = {};
    for (const item of validItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    const result = CATEGORIES.filter(
      (cat) =>
        groups[cat] && Array.isArray(groups[cat]) && groups[cat].length > 0,
    ).map((cat) => ({ title: cat, data: groups[cat]!.filter(Boolean) }));
    console.log(
      "[HomeScreen] groupedItems:",
      JSON.stringify(
        result.map((s) => ({ category: s.title, count: s.data.length })),
      ),
    );
    return result;
  }, [list]);

  const totalItems = list?.length ?? 0;
  const estimatedTotal =
    list?.reduce((sum, item) => sum + (item.estimated_price || 0), 0) ?? 0;

  const handleTogglePurchased = (id: string, purchased: boolean) => {
    // In home screen, just visual feedback - actual purchase happens in purchase mode
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateItem.mutate({ id, updates: { quantity } });
  };

  const handlePressItem = (item: any) => {
    setShowEditModal(true, item.id);
  };

  const handleLongPress = (item: any) => {
    Alert.alert(item.name, "O que deseja fazer?", [
      { text: "Editar", onPress: () => setShowEditModal(true, item.id) },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => handleDelete(item.id),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Remover item", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => deleteItem.mutate(id),
      },
    ]);
  };

  const handleStartPurchase = async () => {
    if (!list || list.length === 0) {
      Alert.alert("Lista vazia", "Adicione itens antes de iniciar a compra");
      return;
    }
    try {
      await startPurchase.mutateAsync(list);
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao iniciar compra");
    }
  };

  const handleNavigateToHistory = () => {
    navigation.navigate("HistoryList");
  };

  const renderItem = ({ item }: { item: any }) => (
    <ListItem
      item={item}
      onToggle={handleTogglePurchased}
      onPress={handlePressItem}
      onQuantityChange={handleQuantityChange}
      onLongPress={handleLongPress}
    />
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} itens</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛒 Lista de compras</Text>
          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? "item" : "itens"}
          </Text>
        </View>
      </View>

      {totalItems > 0 && groupedItems.length > 0 ? (
        <SectionList
          sections={groupedItems.filter(
            (s) => s && Array.isArray(s.items) && s.items.length > 0,
          )}
          keyExtractor={(item) =>
            item?.id ?? Math.random().toString(36).substr(2, 9)
          }
          renderItem={({ item }) => (item ? renderItem({ item }) : null)}
          renderSectionHeader={({ section }) =>
            section ? renderSectionHeader({ section }) : null
          }
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptySubtitle}>
            Toque em + para adicionar seu primeiro item
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        {estimatedTotal > 0 && (
          <Text style={styles.totalLabel}>
            Total estimado:{" "}
            <Text style={styles.totalValue}>{formatBRL(estimatedTotal)}</Text>
          </Text>
        )}

        <View style={styles.buttonGroup}>
          <Button
            title="+ Adicionar item"
            variant="primary"
            onPress={() => setShowAddModal(true)}
            style={styles.mainButton}
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button
            title="Começar compra"
            variant="secondary"
            onPress={handleStartPurchase}
            disabled={totalItems === 0}
            style={styles.secondaryButton}
          />
          <Button
            title="Histórico"
            variant="ghost"
            onPress={handleNavigateToHistory}
            style={styles.ghostButton}
          />
        </View>
      </View>

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refetch}
      />
      <EditItemModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#212121",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
  listFooter: {
    height: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
  },
  totalValue: {
    fontWeight: "700",
    color: "#2E7D32",
    fontSize: 18,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  mainButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  ghostButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#757575",
  },
});
