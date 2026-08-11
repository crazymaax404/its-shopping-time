import React from 'react';
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
import { formatDateTimeBR } from '@/utils/date';
import { formatBRL } from '@/utils/currency';
import { AppHeader } from '@/components/ui';
import { ShoppingSession } from '@/types/supabase';
import { colors, fontFamily } from '@/theme';

export function HistoryListScreen() {
  const navigation = useNavigation<any>();
  const { data: sessions, isLoading } = useCompletedSessions();

  const renderItem = ({ item }: { item: ShoppingSession }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('HistoryDetail', { sessionId: item.id })
      }
      activeOpacity={0.85}
    >
      <View style={styles.iconBox}>
        <Ionicons name="calendar" size={20} color={colors.primary} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.date}>
          {item.finished_at ? formatDateTimeBR(item.finished_at) : '—'}
        </Text>
        <Text style={styles.subtitle}>Compra concluída</Text>
      </View>
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue}>{formatBRL(item.total_amount)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="time" size={22} color={colors.primary} />
          <Text style={styles.title}>Histórico de Compras</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {sessions?.length ?? 0} REGISTROS
          </Text>
        </View>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      ) : (
        <FlatList
          data={sessions ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma compra finalizada</Text>
              <Text style={styles.emptySubtitle}>
                Suas compras finalizadas aparecerão aqui
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: fontFamily.extraBold,
    color: colors.primaryDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalBlock: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: fontFamily.extraBold,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
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
  loadingText: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
