import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Seat } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';

/** Renders an order's seats as a set of compact chips. */
function SeatListComponent({ seats }: { seats: Seat[] }) {
  if (seats.length === 0) {
    return <Text style={styles.empty}>General admission</Text>;
  }
  return (
    <View style={styles.grid}>
      {seats.map((seat, i) => (
        <View key={`${seat.section}-${seat.row}-${seat.seat}-${i}`} style={styles.chip}>
          <Text style={styles.label}>Section</Text>
          <Text style={styles.value}>{seat.section}</Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.label}>Row</Text>
          <Text style={styles.value}>{seat.row}</Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.label}>Seat</Text>
          <Text style={styles.value}>{seat.seat}</Text>
        </View>
      ))}
    </View>
  );
}

export const SeatList = memo(SeatListComponent);

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  empty: typography.body,
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  label: { ...typography.label, color: colors.textMuted },
  value: { ...typography.bodyStrong },
  sep: { color: colors.textMuted, marginHorizontal: spacing.xs },
});
