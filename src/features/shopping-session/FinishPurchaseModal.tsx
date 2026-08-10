import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ModalWrapper, Button } from '@/components/ui';
import { formatBRL } from '@/utils/currency';

interface FinishPurchaseModalProps {
  sessionId: string;
  totalAmount: number;
  purchasedItemIds: string[];
}

export function FinishPurchaseModal({
  sessionId,
  totalAmount,
  purchasedItemIds,
}: FinishPurchaseModalProps) {
  const navigation = React.useContext(
    React.createContext<any>(null)
  )?.navigation ?? React.useMemo(() => {
    const nav: any = React.useContext(
      React.createContext({ navigate: () => {} })
    );
    return nav;
  }, []);

  // We'll get navigation from the route params
  const route = React.useContext(
    React.createContext<any>({ params: { sessionId, totalAmount, purchasedItemIds } })
  );

  const { sessionId: routeSessionId, totalAmount: routeTotalAmount, purchasedItemIds: routePurchasedItemIds } = route?.params ?? {};

  const handleFinish = async () => {
    // This is handled by the PurchaseScreen via alert
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ModalWrapper
      visible={true}
      onClose={handleCancel}
      title="Finalizar compra"
    >
      <View style={styles.content}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Produtos</Text>
          <Text style={styles.summaryValue}>{purchasedItemIds.length}</Text>
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>{formatBRL(totalAmount)}</Text>
        </View>

        <View style={styles.buttonRow}>
          <Button title="Cancelar" variant="secondary" onPress={handleCancel} />
          <Button title="Confirmar" variant="primary" onPress={handleFinish} />
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    color: '#2E7D32',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});