import React, { Component } from 'react';

export class TaxCalculatorFooter extends Component {
  render() {
    return (
      <div className="TaxCalculator-footer">
        <div className="TaxCalculator-footer-text">
          <sup>*</sup> Berechnete Zinserträge verstehen sich als Näherungswerte und beziehen sich auf die Produktlaufzeit. Maßgeblich für die Verzinsung sind das Angebot und die Berechnungsmethode der Bank. Für Tages- und Flexgeld24 wird ein konstanter Zins unterstellt.
        </div>
      </div>
    )
  }
}

export default TaxCalculatorFooter
