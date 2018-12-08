import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorFooter from './TaxCalculatorFooter';
import TaxCalculatorContent from './TaxCalculatorContent';
import TaxCalculatorHeader from './TaxCalculatorHeader';

class TaxCalculator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      products: {},
      schema: {},
    }
  }

  fetchUrl(url) {
    return fetch(url)
      .then(
        (result) => {
          return result.json();
        }
      );
  }

  componentDidMount() {
    Promise.all([
      this.fetchUrl('http://127.0.0.1:3030/json/products.json'),
      this.fetchUrl('http://127.0.0.1:3030/json/anlageangebote_liste.json'),
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
          <TaxCalculatorHeader />
          <TaxCalculatorContent products={products} schema={schema} />
          <TaxCalculatorFooter />
        </section>
      );
    }
  }
}

export default TaxCalculator;
