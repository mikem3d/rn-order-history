import { useQuery } from '@tanstack/react-query';

import { getOrder, getOrders } from '../api/orders';

/**
 * Centralized query keys. Keeping them in one place prevents cache-key drift
 * (the classic "two components fetch the same thing under different keys" bug).
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (page: number) => [...orderKeys.lists(), { page }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/** Fetches the user's order history (page 1 by default). */
export function useOrders(page = 1) {
  return useQuery({
    queryKey: orderKeys.list(page),
    queryFn: () => getOrders({ page }),
  });
}

/** Fetches a single order's full detail. */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrder(orderId),
  });
}
