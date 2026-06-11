/**
 * A small, centralized design system. Keeping tokens in one place keeps
 * components consistent and makes a future dark-mode / re-skin a one-file change.
 */

export const colors = {
  background: '#0B0B0F',
  surface: '#16161D',
  surfaceElevated: '#1F1F29',
  border: '#2A2A36',
  primary: '#5B8DEF',
  primaryMuted: '#23314F',
  text: '#F5F6FA',
  textSecondary: '#A0A3B1',
  textMuted: '#6B6E7B',
  success: '#3DDC97',
  warning: '#F5A623',
  danger: '#FF6B6B',
  overlay: 'rgba(0,0,0,0.45)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted },
} as const;

/** Maps an order status to a badge color. */
export const statusColor: Record<string, string> = {
  placed: colors.warning,
  confirmed: colors.primary,
  completed: colors.success,
  cancelled: colors.textMuted,
  refunded: colors.danger,
};
