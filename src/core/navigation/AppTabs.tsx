import React from 'react';
import { AppTab, AppTabParamList } from './types';
import { HomeScreen } from '@/features/shopping-list/HomeScreen';
import { HistoryListScreen } from '@/features/history/HistoryListScreen';
import { Ionicons } from '@expo/vector-icons';

export function AppTabNavigator() {
  return (
    <AppTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'Home') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else {
            iconName = 'help-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9E9E9E',
        headerShown: false,
      })}
    >
      <AppTab.Screen name="Home" component={HomeScreen} />
      <AppTab.Screen name="History" component={HistoryListScreen} />
    </AppTab.Navigator>
  );
}