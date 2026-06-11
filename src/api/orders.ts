import { ApiError, simulateRequest } from './client';
import { MOCK_ORDERS } from './mockData';
import type { GetOrderResponse, GetOrdersResponse, Order } from './types';

/**
 * The mock API surface, mirroring the documented REST endpoints:
 *
 *   GET /orders            -> getOrders()
 *   GET /orders/:orderId   -> getOrder(orderId)
 *
 * Orders are returned newest-purchase-first, which is what a history screen wants.
 */

const DEFAULT_PER_PAGE = 20;

function byPurchaseDateDesc(a: Order, b: Order): number {
  return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
}

export interface GetOrdersParams {
  page?: number;
  perPage?: number;
}

/** GET /orders */
export function getOrders({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: GetOrdersParams = {}): Promise<GetOrdersResponse> {
  return simulateRequest(() => {
    const sorted = [...MOCK_ORDERS].sort(byPurchaseDateDesc);
    const start = (page - 1) * perPage;
    const orders = sorted.slice(start, start + perPage);
    return { orders, page, perPage };
  });
}

/** GET /orders/:orderId */
export function getOrder(orderId: string): Promise<GetOrderResponse> {
  return simulateRequest(() => {
    const order = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!order) {
      throw new ApiError(`Order ${orderId} not found`, 404);
    }
    return { order };
  });
}
