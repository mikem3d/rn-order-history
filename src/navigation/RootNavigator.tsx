import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OrderListScreen } from '../screens/OrderListScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{ title: 'Your Orders' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={({ route }) => ({ title: route.params.eventName })}
      />
    </Stack.Navigator>
  );
}
