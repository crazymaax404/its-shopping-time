import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
} from 'react-native';
import { ShoppingListItem } from '@/types/supabase';
import { formatBRL } from '@/utils/currency';

interface ListItemProps {
  item: ShoppingListItem;
  onToggle: (id: string, purchased: boolean) => void;
  onPress: (item: ShoppingListItem) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onLongPress?: (item: ShoppingListItem) => void;
  inPurchaseMode?: boolean;
  purchasedQuantity?: number;
  onPurchasedQuantityChange?: (id: string, quantity: number) => void;
  onPriceChange?: (id: string, priceCents: number) => void;
  priceCents?: number;
  showPriceInput?: boolean;
}

export function ListItem({
  item,
  onToggle,
  onPress,
  onQuantityChange,
  onLongPress,
  inPurchaseMode = false,
  purchasedQuantity = 0,
  onPurchasedQuantityChange,
  onPriceChange,
  priceCents = 0,
  showPriceInput = false,
}: ListItemProps) {
  const [localQty, setLocalQty] = React.useState(item.quantity);
  const [localPurchasedQty, setLocalPurchasedQty] = React.useState(purchasedQuantity);
  const [localPrice, setLocalPrice] = React.useState(priceCents);

  React.useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  React.useEffect(() => {
    setLocalPurchasedQty(purchasedQuantity);
  }, [purchasedQuantity]);

  React.useEffect(() => {
    setLocalPrice(priceCents);
  }, [priceCents]);

  const handleQtyChange = (value: string) => {
    const num = parseInt(value) || 0;
    setLocalQty(num);
    onQuantityChange(item.id, num);
  };

  const handlePurchasedQtyChange = (value: string) => {
    const num = parseInt(value) || 0;
    setLocalPurchasedQty(num);
    onPurchasedQuantityChange?.(item.id, num);
  };

  const handlePriceChange = (value: string) => {
    const cents = parseBRLInput(value);
    setLocalPrice(cents);
    onPriceChange?.(item.id, cents);
  };

  const totalPrice = localPurchasedQty * (localPrice || 0);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !inPurchaseMode && onPress(item)}
      onLongPress={() => onLongPress?.(item)}
      activeOpacity={0.9}
    >
      <View style={styles.mainRow}>
        <View style={styles.leftSection}>
          {inPurchaseMode ? (
            <TouchableOpacity
              onPress={() => onToggle(item.id, localPurchasedQty === 0)}
              style={styles.checkbox}
            >
              <View
                style={[
                  styles.checkboxInner,
                  localPurchasedQty > 0 && styles.checkboxChecked,
                ]}
              >
                {localPurchasedQty > 0 && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onToggle(item.id, false)}
              style={styles.checkbox}
            >
              <View style={[
                styles.checkboxInner,
                styles.checkboxEmpty,
              ]} />
            </TouchableOpacity>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.detail}>
                {localQty} {item.unit}
              </Text>
              {item.notes && (
                <>
                  <Text style={styles.separator}>·</Text>
                  <Text style={styles.note}>{item.notes}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          {inPurchaseMode ? (
            <View style={styles.purchaseInputs}>
              <TextInput
                style={styles.qtyInput}
                value={localPurchasedQty.toString()}
                onChangeText={handlePurchasedQtyChange}
                keyboardType="numeric"
                placeholder="Qtd"
                textAlign="center"
                editable={localPurchasedQty > 0}
              />
              {showPriceInput && (
                <TextInput
                  style={styles.priceInput}
                  value={formatBRLInput(localPrice)}
                  onChangeText={handlePriceChange}
                  keyboardType="decimal-pad"
                  placeholder="Preço"
                  textAlign="right"
                  editable={localPurchasedQty > 0}
                />
              )}
            </View>
          ) : item.estimated_price ? (
            <Text style={styles.estimatedPrice}>
              {formatBRL(item.estimated_price)}
            </Text>
          ) : null}
        </View>
      </View>

      {inPurchaseMode && localPurchasedQty > 0 && showPriceInput && totalPrice > 0 && (
        <Text style={styles.totalPrice}>
          Total: {formatBRL(totalPrice)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  checkboxEmpty: {
    backgroundColor: 'transparent',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  detail: {
    fontSize: 13,
    color: '#757575',
  },
  separator: {
    color: '#BDBDBD',
  },
  note: {
    fontSize: 13,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  estimatedPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
  purchaseInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyInput: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  priceInput: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  totalPrice: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'right',
  },
});

function parseBRLInput(value: string): number {
  const numeric = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(numeric);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

function formatBRLInput(cents: number): string {
  const reais = cents / 100;
  return reais.toFixed(2).replace('.', ',');
}