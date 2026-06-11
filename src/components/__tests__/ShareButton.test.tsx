import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type { Order } from '../../api/types';
import { ShareButton } from '../ShareButton';
import { shareEventCalendar } from '../../utils/share';

jest.mock('../../utils/share', () => ({
  shareEventCalendar: jest.fn(async () => ({ shared: true })),
}));

const mockedShare = shareEventCalendar as jest.MockedFunction<typeof shareEventCalendar>;

const order = {
  id: 'ord_1',
  event: { name: 'Warriors vs. Nuggets' },
} as unknown as Order;

afterEach(() => jest.clearAllMocks());

describe('ShareButton', () => {
  it('renders the share call-to-action', () => {
    render(<ShareButton order={order} />);
    expect(screen.getByText(/Share with Friends/)).toBeOnTheScreen();
  });

  it('triggers calendar sharing for the order when pressed', async () => {
    render(<ShareButton order={order} />);

    fireEvent.press(screen.getByTestId('share-button'));

    await waitFor(() => expect(mockedShare).toHaveBeenCalledWith(order));
  });

  it('ignores a second tap while a share is already in flight', async () => {
    let resolve!: (v: { shared: boolean }) => void;
    mockedShare.mockImplementationOnce(
      () => new Promise((r) => (resolve = r)) as ReturnType<typeof shareEventCalendar>,
    );

    render(<ShareButton order={order} />);
    const button = screen.getByTestId('share-button');

    fireEvent.press(button);
    fireEvent.press(button); // second tap should be ignored while busy

    expect(mockedShare).toHaveBeenCalledTimes(1);
    resolve({ shared: true });
    await waitFor(() => expect(button).toBeEnabled());
  });
});
