import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useProducts,
  useShoppingList,
  useAddListItem,
} from '@/services/supabase/hooks';
import { AppHeader, SearchField } from '@/components/ui';
import { formatBRL } from '@/utils/currency';
import { Product } from '@/types/supabase';
import { colors, fontFamily } from '@/theme';

export function RecentsScreen() {
  const { data: products, isLoading } = useProducts();
  const { data: list } = useShoppingList();
  const addListItem = useAddListItem();
  const [query, setQuery] = useState('');

  const onListByName = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const item of list ?? []) {
      map.set(item.name.toLowerCase(), true);
    }
    return map;
  }, [list]);

  const estimatedByName = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of list ?? []) {
      if (item.estimated_price) {
        map.set(item.name.toLowerCase(), item.estimated_price);
      }
    }
    return map;
  }, [list]);

  const filtered = useMemo(() => {
    const items = products ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  const handleAdd = async (product: Product) => {
    try {
      await addListItem.mutateAsync({
        product_id: product.id,
        name: product.name,
        quantity: product.default_quantity || 1,
        unit: product.default_unit,
        estimated_price: estimatedByName.get(product.name.toLowerCase()) ?? null,
        category: product.category,
        notes: product.notes,
      });
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao adicionar à lista');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <Ionicons name="sparkles" size={22} color={colors.primary} />
              </View>
              <Text style={styles.heroTitle}>
                Comprados Recente & Recorrentes
              </Text>
              <Text style={styles.heroSubtitle}>
                Toque em qualquer produto para adicionar instantaneamente à sua
                lista de compras
              </Text>
            </View>
            <SearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Filtrar produtos conhecidos..."
            />
          </View>
        }
        renderItem={({ item }) => {
          const onList = onListByName.has(item.name.toLowerCase());
          const price = estimatedByName.get(item.name.toLowerCase());
          return (
            <View style={[styles.card, onList && styles.cardOnList]}>
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  {onList && (
                    <View style={styles.onListBadge}>
                      <Text style={styles.onListText}>NA LISTA</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.meta}>
                  {item.default_quantity} {item.default_unit}
                  {price != null ? `  ·  ${formatBRL(price)}` : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAdd(item)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={22} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Carregando...' : 'Nenhum produto conhecido'}
            </Text>
            <Text style={styles.emptySubtitle}>
              Produtos aparecem aqui após você adicioná-los à lista
            </Text>
          </View>
        }
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
    paddingBottom: 24,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 8,
  },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    color: colors.textOnDark,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
  },
  heroSubtitle: {
    color: colors.textOnDarkMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  cardOnList: {
    borderColor: colors.primaryMuted,
    backgroundColor: '#F8FBFF',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
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
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  onListBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  onListText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: fontFamily.extraBold,
    color: colors.primaryDark,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: fontFamily.semiBold,
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
