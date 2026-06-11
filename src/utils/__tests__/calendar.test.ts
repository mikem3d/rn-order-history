import type { Event, Order } from '../../api/types';
import {
  buildICS,
  describeOrderForCalendar,
  escapeText,
  toICSDate,
} from '../calendar';

const event: Event = {
  id: 'evt_1',
  name: 'Warriors vs. Nuggets',
  datetime: '2024-06-14T19:30:00-07:00', // 02:30Z on the 15th
  venue: 'Chase Center, San Francisco, CA',
  imageUrl: 'https://example.com/img.jpg',
};

describe('toICSDate', () => {
  it('formats a Date as a UTC iCal timestamp', () => {
    expect(toICSDate(new Date('2024-06-14T19:30:00-07:00'))).toBe('20240615T023000Z');
  });

  it('zero-pads month, day, and time', () => {
    expect(toICSDate(new Date('2024-01-05T01:02:03Z'))).toBe('20240105T010203Z');
  });
});

describe('escapeText', () => {
  it('escapes commas, semicolons, and backslashes', () => {
    expect(escapeText('a, b; c \\ d')).toBe('a\\, b\\; c \\\\ d');
  });

  it('escapes newlines', () => {
    expect(escapeText('line1\nline2')).toBe('line1\\nline2');
  });
});

describe('buildICS', () => {
  const ics = buildICS(event, 'See you there');

  it('produces a valid VCALENDAR/VEVENT envelope', () => {
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('includes the escaped summary and location', () => {
    expect(ics).toContain('SUMMARY:Warriors vs. Nuggets');
    expect(ics).toContain('LOCATION:Chase Center\\, San Francisco\\, CA');
  });

  it('includes the start time and a default +3h end time', () => {
    expect(ics).toContain('DTSTART:20240615T023000Z');
    expect(ics).toContain('DTEND:20240615T053000Z');
  });

  it('uses the event id in the UID', () => {
    expect(ics).toContain('UID:evt_1@orderhistory.app');
  });

  it('uses CRLF line endings per RFC 5545', () => {
    expect(ics).toContain('\r\n');
  });

  it('honors an explicit end time override', () => {
    const custom = buildICS(event, '', { end: new Date('2024-06-15T04:00:00Z') });
    expect(custom).toContain('DTEND:20240615T040000Z');
  });

  it('throws on an invalid datetime', () => {
    expect(() => buildICS({ ...event, datetime: 'nope' })).toThrow(TypeError);
  });
});

describe('describeOrderForCalendar', () => {
  const baseOrder: Order = {
    id: 'ord_1',
    confirmationNumber: 'ABC123',
    event,
    seats: [{ section: '120', row: '7', seat: '12' }],
    status: 'confirmed',
    purchaseDate: '2024-05-02T16:04:00-07:00',
    receipt: { quantity: 1, pricePerTicket: 100, subtotal: 100, fees: 0, salesTax: 0, total: 100 },
    payment: { method: 'applepay' },
  };

  it('summarizes seats and confirmation number', () => {
    const desc = describeOrderForCalendar(baseOrder);
    expect(desc).toContain('Warriors vs. Nuggets');
    expect(desc).toContain('Sec 120, Row 7, Seat 12');
    expect(desc).toContain('ABC123');
  });

  it('falls back to general admission when there are no seats', () => {
    expect(describeOrderForCalendar({ ...baseOrder, seats: [] })).toContain(
      'General admission',
    );
  });
});
