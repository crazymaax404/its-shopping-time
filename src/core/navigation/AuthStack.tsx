import React from 'react';
import { AuthStack, AuthStackParamList } from './types';
import { LoginScreen } from '@/features/auth/LoginScreen';

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}