import React, { Component } from 'react';
import './TaxCalculator.css';

class TaxCalculator extends Component {
  render() {
    return (
      <div className="TaxCalculator">
        <div className="TaxCalculator-header">
          <div>Betrag</div>
          <div></div>
          <div>Laufzeit</div>
        </div>
        <div className="TaxCalculator-content">
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </div>
        <div className="TaxCalculator-footer">
          <div className="TaxCalculator-footer-text"><sup>*</sup> Berechnete Zinserträge verstehen sich als Näherungswerte und beziehen sich auf die Produktlaufzeit. Maßgeblich für die Verzinsung sind das Angebot und die Berechnungsmethode der Bank. Für Tages- und Flexgeld24 wird ein konstanter Zins unterstellt.</div>
        </div>
      </div>
    );
  }
}

export default TaxCalculator;
