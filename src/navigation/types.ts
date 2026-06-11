import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/** Route params for the root stack. */
export type RootStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: string; eventName: string };
};

export type OrderListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderList'
>;

export type OrderDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderDetail'
>;
