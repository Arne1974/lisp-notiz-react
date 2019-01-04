import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculatorContent from '../TaxCalculatorContent';

it('renders "TaxCalculatorContent" with Error and zero products without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculatorContent error={true} products={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders "TaxCalculatorContent" without Error and zero products without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculatorContent error={false} products={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});