import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalculatorHeader from '../../TaxCalculatorHeader';

it('renders "TaxCalculatorHeader" with mocked values without crashing', () => {
  const div = document.createElement('div');
  const fnMock = jest.fn();
  ReactDOM.render(<TaxCalculatorHeader 
    amountPropsValue={0}
    amountPropsOnInputChange={fnMock}
    amountPropsPlaceholder={0}
    buttonPropsOnButtonClick={null}
    buttonPropsCategoryActive={null}
    durationPropsDurations={[]}
    durationPropsValue={''}
    durationPropsOnSelectChange={fnMock} />, div);
  ReactDOM.unmountComponentAtNode(div);
});