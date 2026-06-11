import * as Sharing from 'expo-sharing';

import type { Order } from '../../api/types';
import { shareEventCalendar } from '../share';

// expo-sharing and expo-file-system are mocked in jest.setup.js.
const mockedSharing = Sharing as jest.Mocked<typeof Sharing>;

const order: Order = {
  id: 'ord_1',
  confirmationNumber: 'ABC123',
  event: {
    id: 'evt_1',
    name: 'Warriors vs. Nuggets',
    datetime: '2024-06-14T19:30:00-07:00',
    venue: 'Chase Center, San Francisco, CA',
    imageUrl: 'https://example.com/img.jpg',
  },
  seats: [{ section: '120', row: '7', seat: '12' }],
  status: 'confirmed',
  purchaseDate: '2024-05-02T16:04:00-07:00',
  receipt: { quantity: 1, pricePerTicket: 100, subtotal: 100, fees: 0, salesTax: 0, total: 100 },
  payment: { method: 'applepay' },
};

afterEach(() => jest.clearAllMocks());

describe('shareEventCalendar', () => {
  it('writes an .ics file and opens the share sheet', async () => {
    const result = await shareEventCalendar(order);

    expect(result.shared).toBe(true);
    expect(mockedSharing.shareAsync).toHaveBeenCalledTimes(1);

    const [uri, options] = mockedSharing.shareAsync.mock.calls[0];
    expect(uri).toMatch(/\.ics$/);
    expect(uri).toContain('warriors-vs-nuggets');
    expect(options).toMatchObject({ mimeType: 'text/calendar' });
  });

  it('reports unavailable gracefully and never throws when sharing is off', async () => {
    mockedSharing.isAvailableAsync.mockResolvedValueOnce(false);
    // The JS Share fallback resolves to dismissed in the test environment.
    await expect(shareEventCalendar(order)).resolves.toBeDefined();
  });

  it('returns an error result instead of throwing when sharing fails', async () => {
    mockedSharing.shareAsync.mockRejectedValueOnce(new Error('boom'));
    const result = await shareEventCalendar(order);
    expect(result).toEqual({ shared: false, reason: 'error' });
  });
});
