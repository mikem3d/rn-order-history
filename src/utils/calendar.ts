import type { Event, Order, Seat } from '../api/types';

/**
 * Calendar sharing.
 *
 * "Share with Friends" generates an iCalendar (.ics) file for the event. .ics is
 * the universal, cross-platform calendar interchange format — opening the shared
 * file adds the event to Apple Calendar, Google Calendar, Outlook, etc. This is
 * preferable to deep-linking a single provider.
 *
 * `buildICS` is a pure function (no I/O) so it is fully unit-testable. The
 * side-effecting `shareEventCalendar` lives below and is thin by design.
 */

const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000; // assume a 3h event

export interface BuildICSOptions {
  /** Event end time. Defaults to start + 3 hours. */
  end?: Date;
  /** Stable identifier used for the VEVENT UID. Defaults to the event id. */
  uid?: string;
  /** Timestamp for DTSTAMP (the moment the file was generated). Defaults to start. */
  dtstamp?: Date;
}

/** Builds a fully-formed VCALENDAR string for an event. */
export function buildICS(
  event: Event,
  description = '',
  options: BuildICSOptions = {},
): string {
  const start = new Date(event.datetime);
  if (Number.isNaN(start.getTime())) {
    throw new TypeError(`Invalid event datetime: ${event.datetime}`);
  }
  const end = options.end ?? new Date(start.getTime() + DEFAULT_DURATION_MS);
  const dtstamp = options.dtstamp ?? start;
  const uid = `${options.uid ?? event.id}@orderhistory.app`;

  // Order matters less than validity, but a conventional ordering helps debugging.
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Order History//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeText(uid)}`,
    `DTSTAMP:${toICSDate(dtstamp)}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeText(event.name)}`,
    `LOCATION:${escapeText(event.venue)}`,
    `DESCRIPTION:${escapeText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  // RFC 5545 lines SHOULD be folded at 75 octets; join with CRLF.
  return lines.map(foldLine).join('\r\n');
}

/** A friendly human-readable description summarizing the seats. */
export function describeOrderForCalendar(order: Order): string {
  const seatText = order.seats.length
    ? order.seats.map(formatSeat).join(', ')
    : 'General admission';
  return [
    `Your tickets for ${order.event.name}.`,
    `Seats: ${seatText}.`,
    `Confirmation #${order.confirmationNumber}.`,
  ].join('\n');
}

function formatSeat(s: Seat): string {
  return `Sec ${s.section}, Row ${s.row}, Seat ${s.seat}`;
}

/** Converts a Date to an iCalendar UTC timestamp: YYYYMMDDTHHMMSSZ. */
export function toICSDate(date: Date): string {
  const p = (n: number, width = 2) => String(n).padStart(width, '0');
  return (
    `${p(date.getUTCFullYear(), 4)}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `T${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}Z`
  );
}

/** Escapes text per RFC 5545 §3.3.11 (backslash, semicolon, comma, newline). */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\n|\r/g, '\\n');
}

/** Folds a content line longer than 75 octets onto continuation lines. */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let remaining = line;
  // First line: 75 chars. Continuation lines: leading space + 74 chars.
  chunks.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    chunks.push(' ' + remaining.slice(0, 74));
    remaining = remaining.slice(74);
  }
  return chunks.join('\r\n');
}
