/**
 * Money helpers. The API speaks in integer cents to avoid floating-point
 * rounding errors; the UI never does math on dollars — only on cents.
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats an integer number of cents as a USD string.
 *
 *   formatCents(123456) === "$1,234.56"
 *   formatCents(-500)   === "-$5.00"
 *   formatCents(0)      === "$0.00"
 */
export function formatCents(cents: number): string {
  if (!Number.isFinite(cents)) {
    throw new TypeError(`formatCents expected a finite number, got ${cents}`);
  }
  // Round defensively in case a non-integer slips through.
  return usdFormatter.format(Math.round(cents) / 100);
}

/**
 * Formats a cents value as a signed adjustment, e.g. a discount line:
 *   formatCentsSigned(-500) === "-$5.00"
 *   formatCentsSigned(500)  === "+$5.00"
 */
export function formatCentsSigned(cents: number): string {
  const sign = cents > 0 ? '+' : cents < 0 ? '-' : '';
  return `${sign}${formatCents(Math.abs(cents))}`;
}
