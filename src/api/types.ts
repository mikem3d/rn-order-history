// ============================================
// CORE ENTITIES
// ============================================

export interface Event {
  id: string;
  name: string;
  /** ISO-8601 timestamp, includes UTC offset (e.g. "2024-06-14T19:30:00-07:00") */
  datetime: string;
  imageUrl: string;
  /** e.g. "Chase Center, San Francisco, CA" */
  venue: string;
}

export interface Seat {
  section: string;
  row: string;
  seat: string;
}

// ============================================
// ORDER / PURCHASE
// ============================================

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  confirmationNumber: string;
  event: Event;
  seats: Seat[];
  status: OrderStatus;
  receipt: Receipt;
  payment: PaymentSummary;
  /** ISO-8601 timestamp */
  purchaseDate: string;
}

// ============================================
// RECEIPT / PRICE BREAKDOWN
// ============================================

export interface Receipt {
  quantity: number;
  /** cents */
  pricePerTicket: number;
  /** cents (price × quantity) */
  subtotal: number;
  /** cents */
  fees: number;
  /** cents */
  salesTax: number;
  discount?: Discount;
  /** cents */
  total: number;
}

export interface Discount {
  code: string;
  /** cents saved */
  amount: number;
}

// ============================================
// PAYMENT
// ============================================

export type PaymentMethod = 'creditcard' | 'applepay' | 'paypal' | 'venmo';

export interface PaymentSummary {
  method: PaymentMethod;
  /** "4242" for cards */
  lastFour?: string;
  /** "visa", "mastercard", etc. */
  cardType?: string;
}

// ============================================
// API RESPONSES
// ============================================

export interface GetOrdersResponse {
  orders: Order[];
  page: number;
  perPage: number;
}

export interface GetOrderResponse {
  order: Order;
}
