import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCompletedSessions } from '@/services/supabase/hooks';
import {
  formatDateBR,
  formatMonthYearBR,
  groupByMonth,
  getMonthOrder,
} from '@/utils/date';
import { formatBRL } from '@/utils/currency';
import { ShoppingSession } from '@/types/supabase';

export function HistoryListScreen() {
  const navigation = useNavigation<any>();
  const { data: sessions, isLoading, refetch } = useCompletedSessions();

  const grouped = useMemo((): Array<{
    month: string;
    sessions: ShoppingSession[];
  }> => {
    if (!sessions) return [];
    const groups = groupByMonth(sessions);
    return Object.entries(groups)
      .sort(([a], [b]) => getMonthOrder(b) - getMonthOrder(a))
      .map(([month, items]) => ({
        month,
        sessions: items as ShoppingSession[],
      }));
  }, [sessions]);

  const renderItem = ({ item }: { item: ShoppingSession }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('HistoryDetail', { sessionId: item.id })
      }
    >
      <View style={styles.itemLeft}>
        <Text style={styles.itemDate}>{formatDateBR(item.finished_at!)}</Text>
        <Text style={styles.itemSubtitle}>
          {item.total_amount > 0 && `${formatBRL(item.total_amount)}  ·  `}
          {/* item count would need a separate query or we can add a count field */}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { month: string; sessions: ShoppingSession[] };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {section.month.charAt(0).toUpperCase() + section.month.slice(1)}
      </Text>
      <Text style={styles.sectionCount}>
        {section.sessions.length} compra
        {section.sessions.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Histórico de compras</Text>
      </View>

      {sessions && sessions.length > 0 ? (
        <FlatList
          data={grouped}
          keyExtractor={(section) => section.month}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {item.month.charAt(0).toUpperCase() + item.month.slice(1)}
                </Text>
                <Text style={styles.sectionCount}>
                  {item.sessions.length} compra
                  {item.sessions.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <FlatList
                data={item.sessions}
                keyExtractor={(s) => s.id}
                renderItem={renderItem}
              />
            </View>
          )}
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Nenhuma compra finalizada</Text>
          <Text style={styles.emptySubtitle}>
            Suas compras finalizadas aparecerão aqui
          </Text>
        </View>
      )}
    </View>
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
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemLeft: {
    flex: 1,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  listFooter: {
    height: 24,
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
