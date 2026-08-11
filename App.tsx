import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AuthProvider } from '@/core/providers/AuthProvider';
import { QueryProvider } from '@/core/providers/QueryProvider';
import { RealtimeProvider } from '@/core/providers/RealtimeProvider';
import { RootNavigator } from '@/core/navigation/RootNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
