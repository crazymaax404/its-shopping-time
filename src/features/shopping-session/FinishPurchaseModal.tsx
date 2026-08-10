import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { ModalWrapper, Button } from '@/components/ui';
import { formatBRL } from '@/utils/currency';
import { useFinishPurchase } from '@/services/supabase/hooks';
import { useUIStore } from '@/stores/uiStore';
import { AppStackParamList } from '@/core/navigation/types';
import { colors } from '@/theme';

export function FinishPurchaseModal() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<AppStackParamList, 'FinishPurchase'>>();
  const { sessionId, totalAmount, purchasedItemIds } = route.params;
  const finishPurchase = useFinishPurchase();
  const setActiveSessionId = useUIStore((s) => s.setActiveSessionId);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await finishPurchase.mutateAsync({
        sessionId,
        totalAmount,
        purchasedItemIds,
      });
      setActiveSessionId(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AppTabs', params: { screen: 'Lista' } }],
      });
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao finalizar compra');
    } finally {
      setLoading(false);
    }
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
          <View style={styles.btnFlex}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={handleCancel}
              disabled={loading}
            />
          </View>
          <View style={styles.btnFlex}>
            <Button
              title="Confirmar"
              variant="primary"
              onPress={handleFinish}
              loading={loading}
            />
          </View>
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
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btnFlex: {
    flex: 1,
  },
});
