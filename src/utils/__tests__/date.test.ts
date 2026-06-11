import {
  formatEventDate,
  formatEventDateTime,
  formatEventTime,
  formatPurchaseDate,
} from '../date';

// Tests pass an explicit timeZone so output is deterministic on any CI machine.
const TZ = 'America/Los_Angeles';
const ISO = '2024-06-14T19:30:00-07:00';

describe('date formatting', () => {
  it('formats the event date', () => {
    expect(formatEventDate(ISO, TZ)).toBe('Fri, Jun 14, 2024');
  });

  it('formats the event time', () => {
    expect(formatEventTime(ISO, TZ)).toBe('7:30 PM');
  });

  it('formats combined date + time', () => {
    expect(formatEventDateTime(ISO, TZ)).toBe('Fri, Jun 14, 2024 · 7:30 PM');
  });

  it('formats a purchase date', () => {
    expect(formatPurchaseDate('2024-05-02T16:04:00-07:00', TZ)).toBe('May 2, 2024');
  });

  it('respects the timezone when converting the instant', () => {
    // Same instant rendered in New York is 3 hours later -> 10:30 PM.
    expect(formatEventTime(ISO, 'America/New_York')).toBe('10:30 PM');
  });

  it('throws on an invalid date string', () => {
    expect(() => formatEventDate('not-a-date', TZ)).toThrow(TypeError);
  });
});
