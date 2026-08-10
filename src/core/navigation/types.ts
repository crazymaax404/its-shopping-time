import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  History: undefined;
};

export type PurchaseStackParamList = {
  Purchase: { sessionId: string };
  FinishPurchase: {
    sessionId: string;
    totalAmount: number;
    purchasedItemIds: string[];
  };
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  HistoryDetail: { sessionId: string };
};

export type AppStackParamList = {
  AppTabs: undefined;
  Purchase: { sessionId: string };
  FinishPurchase: {
    sessionId: string;
    totalAmount: number;
    purchasedItemIds: string[];
  };
  HistoryList: undefined;
  HistoryDetail: { sessionId: string };
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();
export const AuthStack = createNativeStackNavigator<AuthStackParamList>();
export const AppTab = createBottomTabNavigator<AppTabParamList>();
export const PurchaseStack =
  createNativeStackNavigator<PurchaseStackParamList>();
export const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
export const AppStack = createNativeStackNavigator<AppStackParamList>();
