import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useSessionItems,
  useUpdatePurchaseItem,
  useActiveSession,
} from '@/services/supabase/hooks';
import { useUIStore } from '@/stores/uiStore';
import {
  AppHeader,
  SummaryCard,
  ListItem,
  Button,
} from '@/components/ui';
import { RegisterPriceModal } from './RegisterPriceModal';
import { ShoppingItem } from '@/types/supabase';
import { colors, fontFamily } from '@/theme';

export function PurchaseScreen() {
  const navigation = useNavigation<any>();
  const { data: session, isLoading: sessionLoading } = useActiveSession();
  const storedSessionId = useUIStore((s) => s.activeSessionId);
  const setActiveSessionId = useUIStore((s) => s.setActiveSessionId);
  const sessionId = session?.id ?? storedSessionId ?? '';

  const { data: items, isLoading } = useSessionItems(sessionId);
  const updateItem = useUpdatePurchaseItem();

  const [purchased, setPurchased] = useState<
    Record<string, { qty: number; totalCents: number }>
  >({});
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  useEffect(() => {
    if (session?.id) {
      setActiveSessionId(session.id);
    } else if (!sessionLoading && session === null && storedSessionId) {
      // stale persisted id after completed/cancelled session
      setActiveSessionId(null);
    }
  }, [session, sessionLoading, storedSessionId, setActiveSessionId]);

  useEffect(() => {
    if (!items) return;
    const next: Record<string, { qty: number; totalCents: number }> = {};
    for (const item of items) {
      if (item.total_price > 0) {
        next[item.id] = {
          qty: item.quantity,
          totalCents: item.total_price,
        };
      }
    }
    setPurchased(next);
  }, [items]);

  const totalPaid = useMemo(() => {
    return Object.values(purchased).reduce((sum, p) => sum + p.totalCents, 0);
  }, [purchased]);

  const inCart = Object.keys(purchased).length;
  const totalItems = items?.length ?? 0;

  const handleToggle = (item: ShoppingItem) => {
    if (purchased[item.id]) {
      Alert.alert(item.name, 'Remover do carrinho?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setPurchased((prev) => {
              const copy = { ...prev };
              delete copy[item.id];
              return copy;
            });
            updateItem.mutate({
              id: item.id,
              updates: { unit_price: 0, total_price: 0 },
            });
          },
        },
      ]);
      return;
    }
    setEditingItem(item);
  };

  const handleConfirmPrice = (quantity: number, totalCents: number) => {
    if (!editingItem) return;
    const unitPrice =
      quantity > 0 ? Math.round(totalCents / quantity) : 0;
    setPurchased((prev) => ({
      ...prev,
      [editingItem.id]: { qty: quantity, totalCents },
    }));
    updateItem.mutate({
      id: editingItem.id,
      updates: {
        quantity,
        unit_price: unitPrice,
        total_price: totalCents,
      },
    });
    setEditingItem(null);
  };

  const handleFinish = () => {
    if (inCart === 0 || !sessionId) return;
    navigation.navigate('FinishPurchase', {
      sessionId,
      totalAmount: totalPaid,
      purchasedItemIds: Object.keys(purchased),
    });
  };

  if (sessionLoading || (sessionId && isLoading)) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.loadingText}>Carregando compra...</Text>
      </View>
    );
  }

  if (!sessionLoading && !sessionId) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhuma compra ativa</Text>
          <Text style={styles.emptySubtitle}>
            Comece uma compra na aba Lista para ver os itens aqui
          </Text>
          <Button
            title="Ir para Lista"
            onPress={() => navigation.navigate('Lista')}
            style={{ marginTop: 16, maxWidth: 220 }}
            fullWidth={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <SummaryCard
            variant="market"
            inCart={inCart}
            totalItems={totalItems}
            totalPaid={totalPaid}
            onBack={() => navigation.navigate('Lista')}
            onFinish={handleFinish}
          />
        }
        renderItem={({ item }) => (
          <ListItem
            variant="market"
            name={item.name}
            quantity={item.quantity}
            unit={item.unit}
            plannedPriceCents={item.unit_price || undefined}
            checked={!!purchased[item.id]}
            paidTotalCents={purchased[item.id]?.totalCents}
            onToggle={() => handleToggle(item)}
          />
        )}
      />

      <RegisterPriceModal
        visible={!!editingItem}
        itemName={editingItem?.name ?? ''}
        unit={editingItem?.unit ?? 'unidade'}
        initialQuantity={editingItem?.quantity ?? 1}
        initialTotalCents={
          editingItem
            ? purchased[editingItem.id]?.totalCents ??
              (editingItem.unit_price > 0
                ? editingItem.unit_price * editingItem.quantity
                : 0)
            : 0
        }
        onClose={() => setEditingItem(null)}
        onConfirm={handleConfirmPrice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
