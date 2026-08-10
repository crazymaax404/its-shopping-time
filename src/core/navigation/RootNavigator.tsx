import React from 'react';
import { RootStack, RootStackParamList } from './types';
import { AuthStackNavigator } from './AuthStack';
import { AppStackNavigator } from './AppStack';
import { useAuth } from '@/features/auth/useAuth';

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="App" component={AppStackNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </RootStack.Navigator>
  );
}