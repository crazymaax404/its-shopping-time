import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListItem } from '@/types/supabase';
import { formatBRL } from '@/utils/currency';
import { colors } from '@/theme';

interface ListVariantProps {
  variant?: 'list';
  item: ShoppingListItem;
  checked?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface MarketVariantProps {
  variant: 'market';
  name: string;
  quantity: number;
  unit: string;
  plannedPriceCents?: number;
  checked: boolean;
  paidTotalCents?: number;
  onToggle: () => void;
}

type ListItemProps = ListVariantProps | MarketVariantProps;

export function ListItem(props: ListItemProps) {
  if (props.variant === 'market') {
    const price =
      props.checked && props.paidTotalCents != null
        ? props.paidTotalCents
        : props.plannedPriceCents ?? 0;

    return (
      <TouchableOpacity
        style={styles.marketRow}
        onPress={props.onToggle}
        activeOpacity={0.85}
      >
        <View
          style={[styles.checkbox, props.checked && styles.checkboxChecked]}
        >
          {props.checked && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        <View style={styles.marketInfo}>
          <Text style={styles.name}>{props.name}</Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {props.quantity} {props.unit} planejado
              </Text>
            </View>
            <View style={styles.chip}>
              <Ionicons
                name="cash-outline"
                size={12}
                color={colors.textSecondary}
              />
              <Text style={styles.chipText}>{formatBRL(price)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const { item, checked = false, onToggle, onEdit, onDelete } = props;

  return (
    <View style={styles.listRow}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>

      <View style={styles.listInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>
              {item.quantity} {item.unit.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.estPrice}>
          Est.:{' '}
          {item.estimated_price != null
            ? formatBRL(item.estimated_price)
            : '—'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} hitSlop={10}>
          <Ionicons name="create-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  listInfo: {
    flex: 1,
    gap: 4,
  },
  marketInfo: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  qtyBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  qtyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  estPrice: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
