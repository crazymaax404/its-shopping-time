import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useShoppingList,
  useDeleteListItem,
  useStartPurchase,
} from '@/services/supabase/hooks';
import { useUIStore } from '@/stores/uiStore';
import { EditItemModal } from './EditItemModal';
import {
  AppHeader,
  QuickAddCard,
  SummaryCard,
  SearchField,
  ListItem,
} from '@/components/ui';
import { ShoppingListItem } from '@/types/supabase';
import { colors, fontFamily } from '@/theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data: list, isLoading } = useShoppingList();
  const {
    showEditModal,
    setShowEditModal,
  } = useUIStore();
  const deleteItem = useDeleteListItem();
  const startPurchase = useStartPurchase();
  const setActiveSessionId = useUIStore((s) => s.setActiveSessionId);

  const [query, setQuery] = useState('');
  const [markedIds, setMarkedIds] = useState<Record<string, boolean>>({});
  const [starting, setStarting] = useState(false);

  const filtered = useMemo(() => {
    const items = list ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [list, query]);

  const totalItems = list?.length ?? 0;
  const markedCount = Object.values(markedIds).filter(Boolean).length;
  const pendingCount = Math.max(0, totalItems - markedCount);
  const estimatedTotal =
    list?.reduce((sum, item) => sum + (item.estimated_price || 0), 0) ?? 0;

  const handleDelete = (item: ShoppingListItem) => {
    Alert.alert('Remover item', `Remover "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => deleteItem.mutate(item.id),
      },
    ]);
  };

  const handleStartPurchase = async () => {
    if (!list || list.length === 0) {
      Alert.alert('Lista vazia', 'Adicione itens antes de iniciar a compra');
      return;
    }
    setStarting(true);
    try {
      const session = await startPurchase.mutateAsync(list);
      setActiveSessionId(session.id);
      navigation.navigate('Mercado');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao iniciar compra');
    } finally {
      setStarting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AppHeader />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <QuickAddCard />
            <SummaryCard
              variant="list"
              itemCount={totalItems}
              pendingCount={pendingCount}
              markedCount={markedCount}
              estimatedTotal={estimatedTotal}
              onStartPurchase={handleStartPurchase}
              starting={starting}
            />
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar item na lista..."
            />
          </View>
        }
        renderItem={({ item }) => (
          <ListItem
            item={item}
            checked={!!markedIds[item.id]}
            onToggle={() =>
              setMarkedIds((prev) => ({
                ...prev,
                [item.id]: !prev[item.id],
              }))
            }
            onEdit={() => setShowEditModal(true, item.id)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Lista vazia</Text>
            <Text style={styles.emptySubtitle}>
              Use o adicionar rápido acima para incluir itens
            </Text>
          </View>
        }
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
    backgroundColor: colors.background,
  },
  headerBlock: {
    gap: 14,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
  },
});
