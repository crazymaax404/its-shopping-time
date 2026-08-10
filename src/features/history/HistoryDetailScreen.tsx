import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import {
  useSessionDetail,
  useSessionItems,
  useBuyAgain,
} from '@/services/supabase/hooks';
import { formatDateTimeBR } from '@/utils/date';
import { formatBRL } from '@/utils/currency';
import { AppHeader } from '@/components/ui';
import { ShoppingItem } from '@/types/supabase';
import { AppStackParamList } from '@/core/navigation/types';
import { colors } from '@/theme';

export function HistoryDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<AppStackParamList, 'HistoryDetail'>>();
  const sessionId = route.params.sessionId;

  const { data: session, isLoading: sessionLoading } =
    useSessionDetail(sessionId);
  const { data: items, isLoading: itemsLoading } = useSessionItems(sessionId);
  const buyAgain = useBuyAgain();

  const handleBuyAgain = async () => {
    Alert.alert('Comprar novamente', 'Adicionar estes itens à lista atual?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Adicionar',
        onPress: async () => {
          try {
            await buyAgain.mutateAsync(sessionId);
            Alert.alert('Sucesso', 'Itens adicionados à lista!');
            navigation.navigate('AppTabs', { screen: 'Lista' });
          } catch (err: any) {
            Alert.alert('Erro', err.message || 'Erro ao adicionar itens');
          }
        },
      },
    ]);
  };

  if (sessionLoading || itemsLoading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.loadingText}>Compra não encontrada</Text>
      </View>
    );
  }

  const itemCount = items?.length ?? 0;

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>
          {item.quantity} {item.unit} • {formatBRL(item.unit_price)} /{' '}
          {item.unit}
        </Text>
      </View>
      <Text style={styles.itemTotal}>{formatBRL(item.total_price)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={items ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Ionicons name="arrow-back" size={18} color={colors.text} />
                <Text style={styles.backText}>Voltar ao Histórico</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.againBtn}
                onPress={handleBuyAgain}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.againText}>Comprar novamente</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryLabel}>Compra realizada em</Text>
                  <Text style={styles.summaryDate}>
                    {session.finished_at
                      ? formatDateTimeBR(session.finished_at)
                      : '—'}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>CONCLUÍDA</Text>
                </View>
              </View>
              <View style={styles.summaryBottom}>
                <Text style={styles.productsCount}>
                  {itemCount} produto{itemCount !== 1 ? 's' : ''} comprado
                  {itemCount !== 1 ? 's' : ''}
                </Text>
                <View style={styles.paidBlock}>
                  <Text style={styles.paidLabel}>TOTAL PAGO</Text>
                  <Text style={styles.paidValue}>
                    {formatBRL(session.total_amount)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>ITENS DO CARRINHO</Text>
          </View>
        }
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  againBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  againText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    padding: 16,
    gap: 16,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
  },
  summaryDate: {
    color: colors.textOnDark,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  statusPill: {
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    color: colors.primaryMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  summaryBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productsCount: {
    color: colors.textOnDarkMuted,
    fontSize: 13,
  },
  paidBlock: {
    alignItems: 'flex-end',
  },
  paidLabel: {
    color: colors.primaryMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  paidValue: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemLeft: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  itemDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  loadingText: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
