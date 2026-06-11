/**
 * A tiny simulated HTTP client.
 *
 * It mimics the timing and failure characteristics of a real network so the UI's
 * loading, error, and retry paths are all reachable without a backend:
 *   - artificial latency on every call
 *   - configurable random failure rate (off by default in tests)
 *   - a typed `ApiError` for non-2xx-style responses
 *
 * Swapping this for `fetch` later means changing only this file and `orders.ts`.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface SimulatorConfig {
  /** Min/max latency in ms applied to every request. */
  latencyMs: { min: number; max: number };
  /** Probability [0,1] that a request fails with a 503. */
  failureRate: number;
}

const config: SimulatorConfig = {
  latencyMs: { min: 250, max: 700 },
  failureRate: 0,
};

/** Override simulator behavior (used by the app entrypoint and tests). */
export function configureSimulator(partial: Partial<SimulatorConfig>): void {
  Object.assign(config, partial);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `produce` after a simulated round-trip. `produce` is a thunk so the
 * "server-side" lookup (and any not-found error it throws) happens *after* the
 * latency, just like a real request.
 */
export async function simulateRequest<T>(produce: () => T): Promise<T> {
  const { min, max } = config.latencyMs;
  await delay(min + Math.random() * (max - min));

  if (config.failureRate > 0 && Math.random() < config.failureRate) {
    throw new ApiError('Service temporarily unavailable', 503);
  }

  return produce();
}
