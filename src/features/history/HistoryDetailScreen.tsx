import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useSessionDetail,
  useSessionItems,
  useBuyAgain,
} from "@/services/supabase/hooks";
import { formatDateTimeBR } from "@/utils/date";
import { formatBRL as formatBRLCurrency } from "@/utils/currency";
import { ShoppingSession, ShoppingItem } from "@/types/supabase";

interface HistoryDetailRouteProps {
  sessionId: string;
}

export function HistoryDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<HistoryDetailRouteProps>();
  const sessionId = route.params.sessionId;

  const { data: session, isLoading: sessionLoading } =
    useSessionDetail(sessionId);
  const { data: items, isLoading: itemsLoading } = useSessionItems(sessionId);
  const buyAgain = useBuyAgain();

  const handleBuyAgain = async () => {
    Alert.alert("Comprar novamente", "Adicionar estes itens à lista atual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Adicionar",
        onPress: async () => {
          try {
            await buyAgain.mutateAsync(sessionId);
            Alert.alert("Sucesso", "Itens adicionados à lista!");
            navigation.goBack();
          } catch (err: any) {
            Alert.alert("Erro", err.message || "Erro ao adicionar itens");
          }
        },
      },
    ]);
  };

  const totalAmount = session?.total_amount ?? 0;

  if (sessionLoading || itemsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Compra não encontrada</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>
            {item.quantity} {item.unit} · {formatBRLCurrency(item.unit_price)}
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemTotal}>
          {formatBRLCurrency(item.total_price)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Compra</Text>
          <Text style={styles.headerDate}>
            {session.finished_at
              ? formatDateTimeBR(session.finished_at)
              : "Em andamento"}
          </Text>
        </View>
        <View style={styles.headerTotal}>
          <Text style={styles.headerTotalLabel}>Total</Text>
          <Text style={styles.headerTotalValue}>
            {formatBRLCurrency(totalAmount)}
          </Text>
        </View>
      </View>

      <FlatList
        data={items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total da compra</Text>
          <Text style={styles.footerTotalValue}>
            {formatBRLCurrency(totalAmount)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.buyAgainButton}
          onPress={handleBuyAgain}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.buyAgainText}>Comprar novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  headerDate: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  headerTotal: {
    alignItems: "flex-end",
  },
  headerTotalLabel: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  headerTotalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  itemDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
    gap: 8,
  },
  itemDetail: {
    fontSize: 13,
    color: "#757575",
  },
  itemRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  footerTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  footerTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },
  buyAgainButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#2E7D32",
  },
  buyAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listFooter: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#757575",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#757575",
  },
});
