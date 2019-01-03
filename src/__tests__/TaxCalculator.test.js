import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculator from '../TaxCalculator';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaxCalculator />, div);
  ReactDOM.unmountComponentAtNode(div);
});
