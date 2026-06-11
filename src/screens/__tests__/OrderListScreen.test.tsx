import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { configureSimulator } from '../../api/client';
import type { OrderListScreenProps } from '../../navigation/types';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { OrderListScreen } from '../OrderListScreen';

beforeAll(() => configureSimulator({ latencyMs: { min: 0, max: 0 }, failureRate: 0 }));

function makeNavigation() {
  return { navigate: jest.fn() } as unknown as OrderListScreenProps['navigation'];
}

describe('OrderListScreen', () => {
  it('shows a loading state, then renders the order list', async () => {
    const navigation = makeNavigation();
    renderWithProviders(
      <OrderListScreen navigation={navigation} route={{ key: 'k', name: 'OrderList' } as never} />,
    );

    // Loading indicator first.
    expect(screen.getByTestId('loading-state')).toBeOnTheScreen();

    // Then the seeded orders.
    await waitFor(() =>
      expect(screen.getByText('Warriors vs. Nuggets')).toBeOnTheScreen(),
    );
    expect(screen.getByText('Billie Eilish — Hit Me Hard and Soft Tour')).toBeOnTheScreen();
  });

  it('navigates to the detail screen when an order is tapped', async () => {
    const navigation = makeNavigation();
    renderWithProviders(
      <OrderListScreen navigation={navigation} route={{ key: 'k', name: 'OrderList' } as never} />,
    );

    await waitFor(() => screen.getByTestId('order-card-ord_001'));
    fireEvent.press(screen.getByTestId('order-card-ord_001'));

    expect(navigation.navigate).toHaveBeenCalledWith('OrderDetail', {
      orderId: 'ord_001',
      eventName: 'Warriors vs. Nuggets',
    });
  });
});
