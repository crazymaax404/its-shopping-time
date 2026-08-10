import { AppStack } from './types';
import { AppTabNavigator } from './AppTabs';
import { PurchaseScreen } from '@/features/shopping-session/PurchaseScreen';
import { FinishPurchaseModal } from '@/features/shopping-session/FinishPurchaseModal';
import { HistoryDetailScreen } from '@/features/history/HistoryDetailScreen';
import { HistoryListScreen } from '@/features/history/HistoryListScreen';

export function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#212121',
        },
        headerTintColor: '#2E7D32',
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
        options={{ title: 'Compra' }}
      />
      <AppStack.Screen
        name="FinishPurchase"
        component={FinishPurchaseModal}
        options={{ title: 'Finalizar', presentation: 'modal' }}
      />
      <AppStack.Screen
        name="HistoryList"
        component={HistoryListScreen}
        options={{ title: 'Histórico' }}
      />
      <AppStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ title: 'Detalhes' }}
      />
    </AppStack.Navigator>
  );
}
