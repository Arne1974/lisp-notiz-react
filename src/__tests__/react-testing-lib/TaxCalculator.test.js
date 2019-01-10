import React from 'react';
import { render } from 'react-testing-library';
import TaxCalculator from '../../TaxCalculator';

it('renders label text correctly', () => {
  const { getByText } = render(<TaxCalculator />);
  expect(getByText('Betrag')).toBeInTheDocument();
});