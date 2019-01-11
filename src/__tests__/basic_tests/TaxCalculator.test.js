import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculator from '../../TaxCalculator';
import { BANK_MODULE } from '../../api';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('BANK_MODULE.length greater 0', () => {
  expect(BANK_MODULE.length).toBeGreaterThan(0)
});
