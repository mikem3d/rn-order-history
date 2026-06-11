import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { OrderStatus } from '../api/types';
import { radius, spacing, statusColor } from '../theme';

const LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

function StatusBadgeComponent({ status }: { status: OrderStatus }) {
  const color = statusColor[status];
  return (
    <View
      style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${LABELS[status]}`}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{LABELS[status]}</Text>
    </View>
  );
}

/** Memoized — a badge only changes when the status string changes. */
export const StatusBadge = memo(StatusBadgeComponent);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: spacing.xs },
  text: { fontSize: 12, fontWeight: '700' },
});
