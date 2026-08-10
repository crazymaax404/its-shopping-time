import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ModalWrapper, Button } from '@/components/ui';
import { formatBRL } from '@/utils/currency';
import { AppStackParamList } from '@/core/navigation/types';

export function FinishPurchaseModal() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'FinishPurchase'>>();
  const { sessionId, totalAmount, purchasedItemIds } = route.params;

  const handleFinish = () => {
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
          <Text style={[styles.summaryValue, styles.totalValue]}>
            {formatBRL(totalAmount)}
          </Text>
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
