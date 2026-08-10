import React from "react";
import { AppStack, AppStackParamList } from "./types";
import { AppTabNavigator } from "./AppTabs";
import { PurchaseScreen } from "@/features/shopping-session/PurchaseScreen";
import { FinishPurchaseModal } from "@/features/shopping-session/FinishPurchaseModal";
import { HistoryDetailScreen } from "@/features/history/HistoryDetailScreen";
import { Ionicons } from "@expo/vector-icons";
import { HistoryListScreen } from "@/features/history/HistoryListScreen";

export function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: "#212121",
        },
        headerTintColor: "#2E7D32",
        headerBackTitleVisible: false,
      }}
    >
      <AppStack.Screen
        name="AppTabs"
        component={AppTabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Purchase"
        component={PurchaseScreen}
        options={{ title: "Compra" }}
      />
      <AppStack.Screen
        name="FinishPurchase"
        component={FinishPurchaseModal}
        options={{ title: "Finalizar", presentation: "modal" }}
      />
      <AppStack.Screen
        name="HistoryList"
        component={HistoryListScreen}
        options={{ title: "Histórico" }}
      />
      <AppStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: "Detalhes" }}
      />
    </AppStack.Navigator>
  );
}
