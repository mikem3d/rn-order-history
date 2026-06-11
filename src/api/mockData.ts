import type { Order } from './types';

/**
 * Seed data for the simulated backend. Covers a range of states a real account
 * would have: different statuses, payment methods, single vs. multi-seat orders,
 * a discount, and a refund — so the UI is exercised across its variants.
 *
 * All monetary amounts are integer cents. Receipt totals are internally
 * consistent (subtotal = price × qty; total = subtotal + fees + tax − discount).
 */
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_001',
    confirmationNumber: 'TKX-4F9A2C',
    status: 'completed',
    purchaseDate: '2024-05-02T16:04:00-07:00',
    event: {
      id: 'evt_warriors_nuggets',
      name: 'Warriors vs. Nuggets',
      datetime: '2024-06-14T19:30:00-07:00',
      venue: 'Chase Center, San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    },
    seats: [
      { section: '120', row: '7', seat: '12' },
      { section: '120', row: '7', seat: '13' },
    ],
    receipt: {
      quantity: 2,
      pricePerTicket: 14500,
      subtotal: 29000,
      fees: 4350,
      salesTax: 2538,
      discount: { code: 'DUBNATION', amount: 2900 },
      total: 32988,
    },
    payment: { method: 'creditcard', lastFour: '4242', cardType: 'visa' },
  },
  {
    id: 'ord_002',
    confirmationNumber: 'TKX-8B1D77',
    status: 'confirmed',
    purchaseDate: '2024-05-20T09:22:00-07:00',
    event: {
      id: 'evt_billie_eilish',
      name: 'Billie Eilish — Hit Me Hard and Soft Tour',
      datetime: '2024-07-09T20:00:00-07:00',
      venue: 'Kia Forum, Inglewood, CA',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    },
    seats: [{ section: 'FLR1', row: 'C', seat: '4' }],
    receipt: {
      quantity: 1,
      pricePerTicket: 32000,
      subtotal: 32000,
      fees: 5120,
      salesTax: 2800,
      total: 39920,
    },
    payment: { method: 'applepay' },
  },
  {
    id: 'ord_003',
    confirmationNumber: 'TKX-2E55A0',
    status: 'placed',
    purchaseDate: '2024-06-01T12:48:00-07:00',
    event: {
      id: 'evt_giants_dodgers',
      name: 'Giants vs. Dodgers',
      datetime: '2024-08-03T18:45:00-07:00',
      venue: 'Oracle Park, San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&q=80',
    },
    seats: [
      { section: 'VR108', row: '14', seat: '1' },
      { section: 'VR108', row: '14', seat: '2' },
      { section: 'VR108', row: '14', seat: '3' },
    ],
    receipt: {
      quantity: 3,
      pricePerTicket: 8900,
      subtotal: 26700,
      fees: 4005,
      salesTax: 2336,
      total: 33041,
    },
    payment: { method: 'paypal' },
  },
  {
    id: 'ord_004',
    confirmationNumber: 'TKX-9C30FF',
    status: 'refunded',
    purchaseDate: '2024-03-11T19:10:00-07:00',
    event: {
      id: 'evt_hamilton',
      name: 'Hamilton',
      datetime: '2024-04-27T14:00:00-07:00',
      venue: 'Orpheum Theatre, San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    },
    seats: [{ section: 'ORCH', row: 'F', seat: '108' }],
    receipt: {
      quantity: 1,
      pricePerTicket: 19900,
      subtotal: 19900,
      fees: 2985,
      salesTax: 1741,
      total: 24626,
    },
    payment: { method: 'creditcard', lastFour: '1881', cardType: 'mastercard' },
  },
  {
    id: 'ord_005',
    confirmationNumber: 'TKX-7A0B12',
    status: 'cancelled',
    purchaseDate: '2024-02-14T08:30:00-08:00',
    event: {
      id: 'evt_sf_symphony',
      name: 'SF Symphony — Beethoven’s Ninth',
      datetime: '2024-03-22T19:30:00-07:00',
      venue: 'Davies Symphony Hall, San Francisco, CA',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    },
    seats: [
      { section: 'BOXA', row: '1', seat: '5' },
      { section: 'BOXA', row: '1', seat: '6' },
    ],
    receipt: {
      quantity: 2,
      pricePerTicket: 11000,
      subtotal: 22000,
      fees: 3300,
      salesTax: 1925,
      total: 27225,
    },
    payment: { method: 'venmo' },
  },
];
