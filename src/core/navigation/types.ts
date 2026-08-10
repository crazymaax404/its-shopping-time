import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabParamList = {
  Lista: undefined;
  Mercado: undefined;
  Recentes: undefined;
  Historico: undefined;
};

export type AppStackParamList = {
  AppTabs: undefined | { screen?: keyof AppTabParamList };
  FinishPurchase: {
    sessionId: string;
    totalAmount: number;
    purchasedItemIds: string[];
  };
  HistoryDetail: { sessionId: string };
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();
export const AuthStack = createNativeStackNavigator<AuthStackParamList>();
export const AppTab = createBottomTabNavigator<AppTabParamList>();
export const AppStack = createNativeStackNavigator<AppStackParamList>();
