
import React from 'react';
import { render } from 'react-testing-library';
import TaxCalculatorContent from '../../TaxCalculatorContent';

it('renders component with zero badge', () => {
  const handleClick = jest.fn()
  // const products = [{
  //   pb: {}, 
  //   p: {}, 
  //   productBankBic: "BUCUROBU", 
  //   productBankName: "Alpha Bank Romania S.A.", 
  //   maturityCode: "FIXED_1Y",
  // }]
  const products = []
  const { getByText } = render(<TaxCalculatorContent 
    error={false}
    products={products}
    amount={1000}
    categoryActive={'both'}
    durationActive={'all'}
    handleLinkClick={handleClick}
    />);
  expect(getByText('Loading...')).toBeInTheDocument();
});

