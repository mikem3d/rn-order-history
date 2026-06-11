import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Order } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';
import { formatEventDateTime } from '../utils/date';
import { formatCents } from '../utils/money';
import { StatusBadge } from './StatusBadge';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

/**
 * A single tappable row in the order-history list.
 *
 * Wrapped in `React.memo`: in a FlatList, the parent re-renders on scroll, pull-
 * to-refresh, etc. Since `order` is a stable reference from the query cache and
 * `onPress` is memoized by the screen, memo lets each row skip re-rendering
 * unless its own data actually changes.
 */
function OrderCardComponent({ order, onPress }: OrderCardProps) {
  const { event, seats, receipt, status } = order;
  const ticketLabel = `${receipt.quantity} ${receipt.quantity === 1 ? 'ticket' : 'tickets'}`;

  return (
    <Pressable
      onPress={() => onPress(order)}
      accessibilityRole="button"
      accessibilityLabel={`${event.name}, ${ticketLabel}, ${formatCents(receipt.total)}`}
      testID={`order-card-${order.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: event.imageUrl }} style={styles.thumb} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={2}>
            {event.name}
          </Text>
          <StatusBadge status={status} />
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {formatEventDateTime(event.datetime)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {event.venue}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={styles.tickets}>{ticketLabel}</Text>
          <Text style={styles.total}>{formatCents(receipt.total)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const OrderCard = memo(OrderCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.7 },
  thumb: { width: 96, height: '100%', minHeight: 120, backgroundColor: colors.surfaceElevated },
  body: { flex: 1, padding: spacing.md, gap: spacing.xs },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: { ...typography.bodyStrong, flex: 1, fontSize: 16 },
  meta: typography.caption,
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  tickets: { ...typography.caption, color: colors.textMuted },
  total: { ...typography.bodyStrong, fontSize: 16 },
});
