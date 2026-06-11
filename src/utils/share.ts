import { Platform, Share } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { Order } from '../api/types';
import { buildICS, describeOrderForCalendar } from './calendar';

/** Slugifies an event name into a safe filename stem. */
function fileStem(order: Order): string {
  const slug = order.event.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'event';
}

export interface ShareResult {
  shared: boolean;
  /** Why a share did not open, when `shared` is false. */
  reason?: 'unavailable' | 'dismissed' | 'error';
}

/**
 * Generates a calendar (.ics) file for the order's event and opens the native
 * share sheet so the user can send it to friends (Messages, Mail, AirDrop, etc.).
 *
 * Strategy:
 *  - Native (iOS/Android): write the .ics to the cache dir and share the file
 *    via expo-sharing. Recipients get a tappable calendar invite.
 *  - Web / no share-sheet: fall back to the JS `Share` API with the .ics text.
 */
export async function shareEventCalendar(order: Order): Promise<ShareResult> {
  const ics = buildICS(order.event, describeOrderForCalendar(order));

  try {
    const canUseSharing =
      Platform.OS !== 'web' && (await Sharing.isAvailableAsync());

    if (canUseSharing) {
      const file = new File(Paths.cache, `${fileStem(order)}.ics`);
      // Overwrite any stale file from a previous share of the same event.
      if (file.exists) file.delete();
      file.create();
      file.write(ics);

      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/calendar',
        dialogTitle: `Share "${order.event.name}"`,
        UTI: 'public.calendar-event',
      });
      return { shared: true };
    }

    // Fallback: share the raw calendar text.
    const result = await Share.share({
      title: order.event.name,
      message: ics,
    });
    return result.action === Share.dismissedAction
      ? { shared: false, reason: 'dismissed' }
      : { shared: true };
  } catch (err) {
    console.warn('[shareEventCalendar] failed', err);
    return { shared: false, reason: 'error' };
  }
}
