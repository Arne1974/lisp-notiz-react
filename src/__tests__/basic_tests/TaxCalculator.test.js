import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculator from '../../TaxCalculator';
import TaxCalculatorBankModule from '../../TaxCalculatorBankModule';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('TaxCalculatorBankModule.length greater 0', () => {
  expect(TaxCalculatorBankModule.length).toBeGreaterThan(0)
});
