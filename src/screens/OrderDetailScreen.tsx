import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventHeader } from '../components/EventHeader';
import { ReceiptBreakdown } from '../components/ReceiptBreakdown';
import { SeatList } from '../components/SeatList';
import { Section } from '../components/Section';
import { ShareButton } from '../components/ShareButton';
import { StatusBadge } from '../components/StatusBadge';
import { ErrorState, LoadingState } from '../components/StateViews';
import { useOrder } from '../hooks/useOrders';
import type { OrderDetailScreenProps } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { formatPurchaseDate } from '../utils/date';
import { formatPayment } from '../utils/payment';

export function OrderDetailScreen({ route }: OrderDetailScreenProps) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch } = useOrder(orderId);

  if (isLoading) return <LoadingState message="Loading order…" />;
  if (isError || !data) {
    return <ErrorState title="Order unavailable" onRetry={refetch} />;
  }

  const { order } = data;

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <EventHeader event={order.event} />

      <View style={styles.statusRow}>
        <StatusBadge status={order.status} />
        <Text style={styles.confirmation}>#{order.confirmationNumber}</Text>
      </View>

      <Section title="Seats">
        <SeatList seats={order.seats} />
      </Section>

      <Section title="Receipt">
        <ReceiptBreakdown receipt={order.receipt} />
      </Section>

      <Section title="Payment">
        <View style={styles.kv}>
          <Text style={styles.kvLabel}>Method</Text>
          <Text style={styles.kvValue}>{formatPayment(order.payment)}</Text>
        </View>
        <View style={styles.kv}>
          <Text style={styles.kvLabel}>Purchased</Text>
          <Text style={styles.kvValue}>{formatPurchaseDate(order.purchaseDate)}</Text>
        </View>
      </Section>

      <ShareButton order={order} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.xl },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -spacing.sm,
  },
  confirmation: { ...typography.caption, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  kvLabel: { ...typography.body, color: colors.textSecondary },
  kvValue: typography.bodyStrong,
});
