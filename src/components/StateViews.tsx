import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

/** Centered spinner with an optional message. */
export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <View style={styles.center} testID="loading-state">
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.caption}>{message}</Text>
    </View>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Error view with a retry affordance. */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this right now.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.center} testID="error-state">
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
          testID="retry-button"
        >
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

/** Empty-list placeholder. */
export function EmptyState({
  title = 'No orders yet',
  message = 'When you buy tickets, your orders will show up here.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <View style={styles.center} testID="empty-state">
      <Text style={styles.emoji}>🎟️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emoji: { fontSize: 40, marginBottom: spacing.xs },
  title: typography.heading,
  caption: { ...typography.caption, textAlign: 'center' },
  retry: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  pressed: { opacity: 0.7 },
  retryText: { color: colors.text, fontWeight: '700' },
});
