/**
 * Date/time formatting.
 *
 * Event `datetime` strings carry an explicit UTC offset, so the underlying
 * instant is unambiguous. For *display* we render in a fixed venue timezone by
 * default (most venues in the seed data are on the US West Coast). Tests pass an
 * explicit `timeZone` so output is deterministic regardless of the runner's TZ.
 *
 * A production app would store an IANA timezone per venue; see README tradeoffs.
 */

const DEFAULT_TZ = 'America/Los_Angeles';

/** "Fri, Jun 14, 2024" */
export function formatEventDate(iso: string, timeZone: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(parse(iso));
}

/** "7:30 PM" */
export function formatEventTime(iso: string, timeZone: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(parse(iso));
}

/** "Fri, Jun 14, 2024 · 7:30 PM" */
export function formatEventDateTime(iso: string, timeZone: string = DEFAULT_TZ): string {
  return `${formatEventDate(iso, timeZone)} · ${formatEventTime(iso, timeZone)}`;
}

/** "Purchased Mar 3, 2024" style short date. */
export function formatPurchaseDate(iso: string, timeZone: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(parse(iso));
}

function parse(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new TypeError(`Invalid date string: ${iso}`);
  }
  return d;
}
