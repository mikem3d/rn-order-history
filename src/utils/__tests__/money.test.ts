import { formatCents, formatCentsSigned } from '../money';

describe('formatCents', () => {
  it('formats whole dollars', () => {
    expect(formatCents(500)).toBe('$5.00');
  });

  it('formats with thousands separators', () => {
    expect(formatCents(123456)).toBe('$1,234.56');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('formats negative amounts', () => {
    expect(formatCents(-500)).toBe('-$5.00');
  });

  it('rounds non-integer cents defensively', () => {
    expect(formatCents(1050.4)).toBe('$10.50');
    expect(formatCents(1050.6)).toBe('$10.51');
  });

  it('throws on non-finite input', () => {
    expect(() => formatCents(NaN)).toThrow(TypeError);
    expect(() => formatCents(Infinity)).toThrow(TypeError);
  });
});

describe('formatCentsSigned', () => {
  it('prefixes a minus for negatives', () => {
    expect(formatCentsSigned(-2900)).toBe('-$29.00');
  });

  it('prefixes a plus for positives', () => {
    expect(formatCentsSigned(2900)).toBe('+$29.00');
  });

  it('has no sign for zero', () => {
    expect(formatCentsSigned(0)).toBe('$0.00');
  });
});
