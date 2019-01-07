import React from 'react';
import { render } from 'react-testing-library';
import TaxCalculator from '../../TaxCalculator';

it('renders welcome message', () => {
  const { getByText } = render(<TaxCalculator />);
  expect(getByText('Betrag')).toBeInTheDocument();
});