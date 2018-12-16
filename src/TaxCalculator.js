import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorContent from './TaxCalculatorContent';
import TaxCalculatorHeader from './TaxCalculatorHeader';

class TaxCalculator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      products: {},
      schema: {},
      imports: {
        products: 'http://127.0.0.1:3030/json/products.json',
        schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
      },
      amount: 1000,
      categories: ['flex', 'fixed', 'both'],
      durations: [1, 2, 3],

    }
  }

  render() {
    const { loading, products, schema } = this.state;

    if (loading) {
      return (
        <section className="TaxCalculator">
          <div className="loader">Loading... </div>
        </section>
      )
    } else {
      return (
        <section className="TaxCalculator">
          <TaxCalculatorHeader amount={this.state.amount} category={this.state.categories} durations={this.state.durations} />
          <TaxCalculatorContent products={products} schema={schema} />
          <TaxCalculatorFooter />
        </section>
      );
    }
  }

  
  
  componentDidMount() {
    Promise.all([
      fetch(this.state.imports.products)
        .then(
          (result) => {
            return result.json();
          }
        ),
      fetch(this.state.imports.schema)
        .then(
          (result) => {
            return result.json();
          }
        )
    ]).then(
      (values) => {
        this.setState({
          loading: false,
          products: values[0],
          schema: values[1],
        });
      }
    );
  }

  componentWillUnmount() {
    this.setState({})
  }
}

function TaxCalculatorFooter() {
  return (
    <div className="TaxCalculator-footer">
      <div className="TaxCalculator-footer-text">
        <sup>*</sup> Berechnete Zinserträge verstehen sich als Näherungswerte und beziehen sich auf die Produktlaufzeit. Maßgeblich für die Verzinsung sind das Angebot und die Berechnungsmethode der Bank. Für Tages- und Flexgeld24 wird ein konstanter Zins unterstellt.
      </div>
    </div>
  )
}

export default TaxCalculator;
