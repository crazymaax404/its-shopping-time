import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatBRL } from '@/utils/currency';
import { colors, fontFamily } from '@/theme';

interface ListSummaryProps {
  variant: 'list';
  itemCount: number;
  pendingCount: number;
  markedCount: number;
  estimatedTotal: number;
  onStartPurchase: () => void;
  starting?: boolean;
}

interface MarketSummaryProps {
  variant: 'market';
  inCart: number;
  totalItems: number;
  totalPaid: number;
  onBack: () => void;
  onFinish: () => void;
  finishing?: boolean;
}

type SummaryCardProps = ListSummaryProps | MarketSummaryProps;

export function SummaryCard(props: SummaryCardProps) {
  if (props.variant === 'list') {
    return (
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Lista de Compras</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {props.itemCount} {props.itemCount === 1 ? 'ITEM' : 'ITENS'}
            </Text>
          </View>
        </View>
        <Text style={styles.listMeta}>
          {props.pendingCount} pendentes • {props.markedCount} marcados
        </Text>

        <View style={styles.listFooter}>
          <View>
            <Text style={styles.estimateLabel}>ESTIMATIVA TOTAL</Text>
            <Text style={styles.estimateValue}>
              {formatBRL(props.estimatedTotal)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.startBtn,
              (props.starting || props.itemCount === 0) && styles.btnDisabled,
            ]}
            onPress={props.onStartPurchase}
            disabled={props.starting || props.itemCount === 0}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.startBtnText}>Começar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progress =
    props.totalItems > 0
      ? Math.round((props.inCart / props.totalItems) * 100)
      : 0;

  return (
    <View style={styles.marketCard}>
      <View style={styles.marketTop}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={props.onBack}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.marketTitleBlock}>
          <View style={styles.marketTitleRow}>
            <Text style={styles.marketTitle}>Compra no Mercado</Text>
            <Ionicons name="cart" size={16} color={colors.primary} />
          </View>
          <Text style={styles.marketMeta}>
            {props.inCart} de {props.totalItems} produtos no carrinho
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.finishBtn,
            (props.inCart === 0 || props.finishing) && styles.finishBtnDisabled,
          ]}
          onPress={props.onFinish}
          disabled={props.inCart === 0 || props.finishing}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.finishBtnText,
              props.inCart === 0 && styles.finishBtnTextDisabled,
            ]}
          >
            Finalizar Compra
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBox}>
        <Text style={styles.progressLabel}>TOTAL PAGO NO CARRINHO</Text>
        <Text style={styles.progressTotal}>{formatBRL(props.totalPaid)}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPct}>{progress}% concluído</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 6,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.primaryDark,
  },
  listMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  listFooter: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  estimateLabel: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  estimateValue: {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: fontFamily.extraBold,
    color: colors.text,
    marginTop: 2,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  marketCard: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  marketTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketTitleBlock: {
    flex: 1,
    gap: 2,
  },
  marketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  marketTitle: {
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
  },
  marketMeta: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
  },
  finishBtn: {
    backgroundColor: colors.navySoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  finishBtnDisabled: {
    opacity: 0.7,
  },
  finishBtnText: {
    color: colors.primaryMuted,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
  },
  finishBtnTextDisabled: {
    color: colors.textOnDarkMuted,
  },
  progressBox: {
    backgroundColor: colors.navySoft,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  progressLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    letterSpacing: 0.4,
  },
  progressTotal: {
    color: colors.textOnDark,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: fontFamily.extraBold,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.navy,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  progressPct: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
