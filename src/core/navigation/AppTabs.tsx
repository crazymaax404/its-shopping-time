import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTab } from './types';
import { HomeScreen } from '@/features/shopping-list/HomeScreen';
import { PurchaseScreen } from '@/features/shopping-session/PurchaseScreen';
import { RecentsScreen } from '@/features/recents/RecentsScreen';
import { HistoryListScreen } from '@/features/history/HistoryListScreen';
import { useShoppingList } from '@/services/supabase/hooks';
import { colors } from '@/theme';

function TabIcon({
  name,
  focused,
  label,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
  badge?: number;
}) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons
          name={name}
          size={20}
          color={focused ? colors.primary : colors.tabInactive}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>
        {label}
        {badge != null && badge > 0 ? ` (${badge})` : ''}
      </Text>
    </View>
  );
}

export function AppTabNavigator() {
  const { data: list } = useShoppingList();
  const listCount = list?.length ?? 0;

  return (
    <AppTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <AppTab.Screen
        name="Lista"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'bag-handle' : 'bag-handle-outline'}
              focused={focused}
              label="Lista"
              badge={listCount}
            />
          ),
        }}
      />
      <AppTab.Screen
        name="Mercado"
        component={PurchaseScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'cart' : 'cart-outline'}
              focused={focused}
              label="Mercado"
            />
          ),
        }}
      />
      <AppTab.Screen
        name="Recentes"
        component={RecentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'sparkles' : 'sparkles-outline'}
              focused={focused}
              label="Recentes"
            />
          ),
        }}
      />
      <AppTab.Screen
        name="Historico"
        component={HistoryListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'time' : 'time-outline'}
              focused={focused}
              label="Histórico"
            />
          ),
        }}
      />
    </AppTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    gap: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 11,
    color: colors.tabInactive,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
