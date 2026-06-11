import type { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Fixed insets so layout doesn't depend on async device measurement in tests.
const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** Builds a QueryClient with retries off so failures surface immediately in tests. */
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // retry off: failures should surface immediately, not after backoff.
      // gcTime Infinity: don't schedule a cache-GC timer that outlives the test
      // (otherwise Jest warns about a leaked timer / non-graceful worker exit).
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

/**
 * Renders a component inside the app's providers (React Query + SafeArea).
 * Returns the RNTL result plus the queryClient for assertions/teardown.
 */
export function renderWithProviders(ui: ReactElement) {
  const queryClient = makeTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider initialMetrics={initialMetrics}>{children}</SafeAreaProvider>
    </QueryClientProvider>
  );
  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
}
