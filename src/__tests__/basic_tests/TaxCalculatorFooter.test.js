import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculatorFooter from '../../TaxCalculatorFooter';

it('renders "TaxCalculatorFooter" without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculatorFooter />, div);
  ReactDOM.unmountComponentAtNode(div);
});