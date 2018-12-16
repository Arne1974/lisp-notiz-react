import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorContent from './TaxCalculatorContent';

class TaxCalculator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      products: {},
      schema: {},
      amount: 1000,
      categoryActive: 'both',
      durationActive: 'all',
      durations: [1, 2, 3],
    }
    this.imports = {
      products: 'http://127.0.0.1:3030/json/products.json',
      schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
    }
    this.amountPlaceholder = '1.000 €'
    this.categories = ['both', 'flex', 'fixed']
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
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
          <div className="TaxCalculator-header">
            <div>
              <label>Betrag
                <AmountInput value={this.state.amount} onInputChange={this.handleAmountChange} placeholder={this.amountPlaceholder} />
              </label>
            </div>
            <Buttons onButtonClick={this.handleSwitchClick} categoryActive={this.state.categoryActive} />
            <div>
              <label>Laufzeit
                <Duration durations={this.state.durations} value={this.state.durationActive} onSelectChange={this.handleDurationChange} />
              </label>
            </div>
          </div>
          <TaxCalculatorContent products={products} schema={schema} />
          <TaxCalculatorFooter />
        </section>
      );
    }
  }

  handleDurationChange(event) {
    this.setState({durationActive: event.target.value});
  }

  handleSwitchClick(event) {
    this.setState({categoryActive: event.target.value});
  }

  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }
  
  componentDidMount() {
    Promise.all([
      fetch(this.imports.products)
        .then(
          (result) => {
            return result.json();
          }
        ),
      fetch(this.imports.schema)
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
}

function AmountInput(props) {
  let input = parseInt(props.value)
    if(Number.isNaN(input)) {
      input = ''
    }

  return (
    <input type="text" name="dash-amount" className="dashboard-item-amount"
      id="dash-amount" maxLength="9" 
      placeholder={props.placeholder}
      value={input}
      onChange={props.onInputChange}
       />
  );
}

function Buttons(props) {
  const ActiveAll = (props.categoryActive==='both')? 'active': ''
  const ActiveFlex = (props.categoryActive==='flex')? 'active': ''
  const ActiveFixed = (props.categoryActive==='fixed')? 'active': ''
  return (
    <div>
      <button onClick={props.onButtonClick} className={ActiveAll} id="all-btn" value="both">alle Angebote</button>
      <button onClick={props.onButtonClick} className={ActiveFlex} id="flex-btn" value="flex">Tagesgeld</button>
      <button onClick={props.onButtonClick} className={ActiveFixed} id="fixed-btn" value="fixed">Festgeld</button>
    </div>
  );
}

function Duration(props) {
  let options = props.durations.map((v, i)=> {
    return (<DurationOption duration={v} key={i} />)
  });
  return (
    <select id="dash-maturity" name="dash-maturity" value={props.value} onChange={props.onSelectChange}>
      <option value="all" data-duration="all">Alle anzeigen</option>
      <option value="p.a." data-duration="p.a.">Tages-/Flexgeld</option>
      {options}
    </select>
  );
}

function DurationOption(props) {
  let month = props.duration>1? ' Monate': ' Monat';
  return (
    <option value={props.duration} data-duration={props.duration}>{props.duration}{month}</option>
  )
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
