import { ApiError, configureSimulator } from '../client';
import { getOrder, getOrders } from '../orders';

// Make the simulated network fast and deterministic for tests.
beforeAll(() => {
  configureSimulator({ latencyMs: { min: 0, max: 0 }, failureRate: 0 });
});

describe('getOrders', () => {
  it('returns orders sorted newest purchase first', async () => {
    const { orders } = await getOrders();
    const dates = orders.map((o) => new Date(o.purchaseDate).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it('echoes the requested pagination', async () => {
    const res = await getOrders({ page: 1, perPage: 2 });
    expect(res.page).toBe(1);
    expect(res.perPage).toBe(2);
    expect(res.orders).toHaveLength(2);
  });

  it('returns an empty page beyond the data set', async () => {
    const res = await getOrders({ page: 99, perPage: 10 });
    expect(res.orders).toEqual([]);
  });
});

describe('getOrder', () => {
  it('returns a single order by id', async () => {
    const { order } = await getOrder('ord_001');
    expect(order.id).toBe('ord_001');
    expect(order.event.name).toBe('Warriors vs. Nuggets');
  });

  it('rejects with a 404 ApiError for an unknown id', async () => {
    await expect(getOrder('does_not_exist')).rejects.toBeInstanceOf(ApiError);
    await expect(getOrder('does_not_exist')).rejects.toMatchObject({ status: 404 });
  });
});

describe('failure injection', () => {
  afterEach(() => configureSimulator({ failureRate: 0 }));

  it('throws a 503 ApiError when the failure rate is 1', async () => {
    configureSimulator({ failureRate: 1 });
    await expect(getOrders()).rejects.toMatchObject({ status: 503 });
  });
});
