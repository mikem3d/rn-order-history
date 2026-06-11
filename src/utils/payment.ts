import type { PaymentSummary } from '../api/types';

const METHOD_LABELS: Record<PaymentSummary['method'], string> = {
  creditcard: 'Card',
  applepay: 'Apple Pay',
  paypal: 'PayPal',
  venmo: 'Venmo',
};

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Human-readable payment label:
 *   { creditcard, visa, 4242 } -> "Visa •••• 4242"
 *   { creditcard, undefined, 4242 } -> "Card •••• 4242"
 *   { applepay } -> "Apple Pay"
 */
export function formatPayment(payment: PaymentSummary): string {
  const brand = payment.cardType ? titleCase(payment.cardType) : METHOD_LABELS[payment.method];
  if (payment.method === 'creditcard' && payment.lastFour) {
    return `${brand} •••• ${payment.lastFour}`;
  }
  return METHOD_LABELS[payment.method];
}
