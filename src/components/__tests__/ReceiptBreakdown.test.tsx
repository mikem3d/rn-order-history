import { render, screen } from '@testing-library/react-native';

import type { Receipt } from '../../api/types';
import { ReceiptBreakdown } from '../ReceiptBreakdown';

const receipt: Receipt = {
  quantity: 2,
  pricePerTicket: 14500,
  subtotal: 29000,
  fees: 4350,
  salesTax: 2538,
  discount: { code: 'DUBNATION', amount: 2900 },
  total: 32988,
};

describe('ReceiptBreakdown', () => {
  it('renders each line item with formatted amounts', () => {
    render(<ReceiptBreakdown receipt={receipt} />);

    expect(screen.getByText('Tickets ($145.00 × 2)')).toBeOnTheScreen();
    expect(screen.getByText('$290.00')).toBeOnTheScreen();
    expect(screen.getByText('Service fees')).toBeOnTheScreen();
    expect(screen.getByText('$43.50')).toBeOnTheScreen();
    expect(screen.getByText('Sales tax')).toBeOnTheScreen();
    expect(screen.getByText('$25.38')).toBeOnTheScreen();
    expect(screen.getByText('$329.88')).toBeOnTheScreen();
  });

  it('renders a discount line as a negative amount when present', () => {
    render(<ReceiptBreakdown receipt={receipt} />);
    expect(screen.getByText('Discount (DUBNATION)')).toBeOnTheScreen();
    expect(screen.getByText('−$29.00')).toBeOnTheScreen();
  });

  it('omits the discount line when there is no discount', () => {
    const { discount, ...noDiscount } = receipt;
    render(<ReceiptBreakdown receipt={noDiscount} />);
    expect(screen.queryByText(/Discount/)).toBeNull();
  });
});
