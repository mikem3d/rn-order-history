import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import type { Order } from '../api/types';
import { colors, radius, spacing } from '../theme';
import { shareEventCalendar } from '../utils/share';

/**
 * "Share with Friends" — generates a calendar invite for the event and opens the
 * native share sheet. Disabled while a share is in flight to avoid double-taps.
 */
export function ShareButton({ order }: { order: Order }) {
  const [busy, setBusy] = useState(false);

  async function handlePress() {
    if (busy) return;
    setBusy(true);
    try {
      await shareEventCalendar(order);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel="Share with Friends"
      accessibilityState={{ busy, disabled: busy }}
      testID="share-button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {busy ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={styles.text}>📅  Share with Friends</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  pressed: { opacity: 0.8 },
  text: { color: colors.text, fontWeight: '700', fontSize: 16 },
});
