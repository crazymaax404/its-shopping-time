import { AppStack } from './types';
import { AppTabNavigator } from './AppTabs';
import { FinishPurchaseModal } from '@/features/shopping-session/FinishPurchaseModal';
import { HistoryDetailScreen } from '@/features/history/HistoryDetailScreen';
import { colors } from '@/theme';

export function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: colors.text,
        },
        headerTintColor: colors.primary,
      }}
    >
      <AppStack.Screen
        name="AppTabs"
        component={AppTabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="FinishPurchase"
        component={FinishPurchaseModal}
        options={{ title: 'Finalizar', presentation: 'modal' }}
      />
      <AppStack.Screen
        name="HistoryDetail"
        component={HistoryDetailScreen}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
}
