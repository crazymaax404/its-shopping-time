import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSessionItems, useUpdatePurchaseItem, useFinishPurchase } from '@/services/supabase/hooks';
import { useActiveSession } from '@/services/supabase/hooks';
import { ListItem, Button } from '@/components/ui';
import { formatBRL, parseBRLInput, formatBRLInput } from '@/utils/currency';
import { ShoppingItem } from '@/types/supabase';

interface PurchaseScreenRouteProps {
  sessionId: string;
}

export function PurchaseScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<PurchaseScreenRouteProps>();
  const sessionId = route.params.sessionId;

  const { data: session } = useActiveSession();
  const { data: items, isLoading } = useSessionItems(sessionId);
  const updateItem = useUpdatePurchaseItem();
  const finishPurchase = useFinishPurchase();

  const [purchasedQuantities, setPurchasedQuantities] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});

  const totalAmount = useMemo(() => {
    if (!items) return 0;
    return items.reduce((sum, item) => {
      const qty = purchasedQuantities[item.id] || 0;
      const price = prices[item.id] || 0;
      return sum + qty * price;
    }, 0);
  }, [items, purchasedQuantities, prices]);

  const purchasedItemIds = useMemo(() => {
    if (!items) return [];
    return items
      .filter((item) => (purchasedQuantities[item.id] || 0) > 0)
      .map((item) => item.id);
  }, [items, purchasedQuantities]);

  const handlePurchasedQtyChange = (id: string, quantity: number) => {
    setPurchasedQuantities((prev) => ({ ...prev, [id]: quantity }));
    updateItem.mutate({
      id,
      updates: { quantity },
    });
  };

  const handlePriceChange = (id: string, priceCents: number) => {
    setPrices((prev) => ({ ...prev, [id]: priceCents }));
    updateItem.mutate({
      id,
      updates: { unit_price: priceCents, total_price: priceCents * (purchasedQuantities[id] || 0) },
    });
  };

  const handleFinish = async () => {
    if (purchasedItemIds.length === 0) {
      Alert.alert('Nenhum item comprado', 'Marque pelo menos um item como comprado');
      return;
    }

    Alert.alert(
      'Finalizar compra?',
      `${purchasedItemIds.length} produtos\nTotal: ${formatBRL(totalAmount)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            try {
              await finishPurchase.mutateAsync({
                sessionId,
                totalAmount,
                purchasedItemIds,
              });
              navigation.navigate('AppTabs', { screen: 'Home' });
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Erro ao finalizar compra');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ListItem
      item={{
        ...item,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        notes: item.notes,
        estimated_price: item.unit_price,
      } as any}
      onToggle={() => {}}
      onPress={() => {}}
      onQuantityChange={() => {}}
      inPurchaseMode={true}
      purchasedQuantity={purchasedQuantities[item.id] || 0}
      onPurchasedQuantityChange={handlePurchasedQtyChange}
      onPriceChange={handlePriceChange}
      priceCents={prices[item.id] || 0}
      showPriceInput={true}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando compra...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Text style={styles.sessionTitle}>Compra em andamento</Text>
        <Text style={styles.sessionSubtitle}>
          {items?.length ?? 0} itens na lista
        </Text>
      </View>

      <FlatList
        data={items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatBRL(totalAmount)}</Text>
        </View>

        <Button
          title="Finalizar compra"
          variant="primary"
          onPress={handleFinish}
          disabled={purchasedItemIds.length === 0}
          style={styles.finishButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
  listFooter: {
    height: 140,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  finishButton: {
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
  },
});