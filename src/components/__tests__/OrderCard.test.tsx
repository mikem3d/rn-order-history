import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Order } from '../../api/types';
import { OrderCard } from '../OrderCard';

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
  status: 'completed',
  purchaseDate: '2024-05-02T16:04:00-07:00',
  receipt: {
    quantity: 2,
    pricePerTicket: 14500,
    subtotal: 29000,
    fees: 4350,
    salesTax: 2538,
    total: 32988,
  },
  payment: { method: 'visa' as never, lastFour: '4242' },
};

describe('OrderCard', () => {
  it('renders the event name, venue, ticket count, and total', () => {
    render(<OrderCard order={order} onPress={jest.fn()} />);

    expect(screen.getByText('Warriors vs. Nuggets')).toBeOnTheScreen();
    expect(screen.getByText('Chase Center, San Francisco, CA')).toBeOnTheScreen();
    expect(screen.getByText('2 tickets')).toBeOnTheScreen();
    expect(screen.getByText('$329.88')).toBeOnTheScreen();
  });

  it('shows the order status badge', () => {
    render(<OrderCard order={order} onPress={jest.fn()} />);
    expect(screen.getByText('Completed')).toBeOnTheScreen();
  });

  it('uses singular "ticket" for a quantity of one', () => {
    const single = { ...order, receipt: { ...order.receipt, quantity: 1 } };
    render(<OrderCard order={single} onPress={jest.fn()} />);
    expect(screen.getByText('1 ticket')).toBeOnTheScreen();
  });

  it('invokes onPress with the order when tapped', () => {
    const onPress = jest.fn();
    render(<OrderCard order={order} onPress={onPress} />);

    fireEvent.press(screen.getByTestId('order-card-ord_1'));

    expect(onPress).toHaveBeenCalledWith(order);
  });
});
