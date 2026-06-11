import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Receipt } from '../api/types';
import { colors, spacing, typography } from '../theme';
import { formatCents } from '../utils/money';

interface RowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  positive?: boolean;
}

function LineItem({ label, value, emphasis, positive }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, emphasis && styles.emphasisLabel]}>{label}</Text>
      <Text
        style={[
          styles.value,
          emphasis && styles.emphasisValue,
          positive && styles.positive,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/** The itemized price breakdown for an order's receipt. */
function ReceiptBreakdownComponent({ receipt }: { receipt: Receipt }) {
  const perTicket = `${formatCents(receipt.pricePerTicket)} × ${receipt.quantity}`;
  return (
    <View style={styles.container} testID="receipt-breakdown">
      <LineItem label={`Tickets (${perTicket})`} value={formatCents(receipt.subtotal)} />
      <LineItem label="Service fees" value={formatCents(receipt.fees)} />
      <LineItem label="Sales tax" value={formatCents(receipt.salesTax)} />
      {receipt.discount && (
        <LineItem
          label={`Discount (${receipt.discount.code})`}
          value={`−${formatCents(receipt.discount.amount)}`}
          positive
        />
      )}
      <View style={styles.divider} />
      <LineItem label="Total" value={formatCents(receipt.total)} emphasis />
    </View>
  );
}

export const ReceiptBreakdown = memo(ReceiptBreakdownComponent);

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.body, color: colors.textSecondary, flex: 1, marginRight: spacing.md },
  value: { ...typography.body, fontVariant: ['tabular-nums'] },
  emphasisLabel: { ...typography.bodyStrong, color: colors.text, fontSize: 16 },
  emphasisValue: { ...typography.bodyStrong, fontSize: 18 },
  positive: { color: colors.success },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
});
