import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/core/providers/AuthProvider';
import { QueryProvider } from '@/core/providers/QueryProvider';
import { RealtimeProvider } from '@/core/providers/RealtimeProvider';
import { RootNavigator } from '@/core/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <AuthProvider>
            <NavigationContainer>
              <RealtimeProvider>
                <RootNavigator />
              </RealtimeProvider>
            </NavigationContainer>
          </AuthProvider>
        </QueryProvider>
        <StatusBar style="dark" backgroundColor="#fff" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}