import { formatPayment } from '../payment';

describe('formatPayment', () => {
  it('shows card brand and last four', () => {
    expect(
      formatPayment({ method: 'creditcard', cardType: 'visa', lastFour: '4242' }),
    ).toBe('Visa •••• 4242');
  });

  it('falls back to "Card" when no brand is present', () => {
    expect(formatPayment({ method: 'creditcard', lastFour: '1881' })).toBe(
      'Card •••• 1881',
    );
  });

  it('renders wallet methods by name', () => {
    expect(formatPayment({ method: 'applepay' })).toBe('Apple Pay');
    expect(formatPayment({ method: 'paypal' })).toBe('PayPal');
    expect(formatPayment({ method: 'venmo' })).toBe('Venmo');
  });
});
