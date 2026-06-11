import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { Event } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';
import { formatEventDate, formatEventTime } from '../utils/date';

/** Hero image + key event facts at the top of the detail screen. */
function EventHeaderComponent({ event }: { event: Event }) {
  return (
    <View>
      <Image source={{ uri: event.imageUrl }} style={styles.hero} />
      <View style={styles.info}>
        <Text style={styles.name}>{event.name}</Text>
        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.value}>{formatEventDate(event.datetime)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>🕖</Text>
          <Text style={styles.value}>{formatEventTime(event.datetime)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.value}>{event.venue}</Text>
        </View>
      </View>
    </View>
  );
}

export const EventHeader = memo(EventHeaderComponent);

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
  },
  info: { paddingTop: spacing.lg, gap: spacing.sm },
  name: { ...typography.title, marginBottom: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { fontSize: 15, width: 20, textAlign: 'center' },
  value: { ...typography.body, flex: 1, color: colors.textSecondary },
});
