import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Order } from '../api/types';
import { OrderCard } from '../components/OrderCard';
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews';
import { useOrders } from '../hooks/useOrders';
import type { OrderListScreenProps } from '../navigation/types';
import { colors, spacing } from '../theme';

export function OrderListScreen({ navigation }: OrderListScreenProps) {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, isRefetching } = useOrders();

  const openDetail = useCallback(
    (order: Order) => {
      navigation.navigate('OrderDetail', {
        orderId: order.id,
        eventName: order.event.name,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderCard order={item} onPress={openDetail} />,
    [openDetail],
  );

  if (isLoading) return <LoadingState message="Loading your orders…" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  const orders = data?.orders ?? [];

  return (
    <FlatList
      data={orders}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.lg },
        orders.length === 0 && styles.emptyContent,
      ]}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={EmptyState}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
    />
  );
}

// Module-level constants so their identity is stable across renders — this lets
// FlatList and the memoized OrderCard rows skip unnecessary re-renders.
const keyExtractor = (order: Order) => order.id;
const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  emptyContent: { flexGrow: 1 },
  separator: { height: spacing.md },
});
