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
      durations: [],
      tracker: {trackingEnable: false, clientId: this.createUniqueId()},
    }
    this.imports = {
      products: 'http://127.0.0.1:3030/json/products.json',
      schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
    }
    this.notToPromote = ['HSHNDEHH', 'CPLUDES1XXX']
    this.amountPlaceholder = '1.000 €'
    this.categories = ['both', 'flex', 'fixed']
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleDurationsAddition = this.handleDurationsAddition.bind(this)
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
            <AmountInput value={this.state.amount} onInputChange={this.handleAmountChange} placeholder={this.amountPlaceholder} />
            <Buttons onButtonClick={this.handleSwitchClick} categoryActive={this.state.categoryActive} />
            <Duration durations={this.state.durations} value={this.state.durationActive} onSelectChange={this.handleDurationChange} />
          </div>
          <TaxCalculatorContent products={products} schema={schema} notToPromote={this.notToPromote} handleDurationsAddition={this.handleDurationsAddition} amount={this.state.amount} />
          <DisplayProps amount={this.state.amount} categoryActive={this.state.categoryActive} durationActive={this.state.durationActive} />
          <TaxCalculatorFooter />
        </section>
      );
    }
  }

  handleDurationsAddition(list) {
    this.setState({durations: list});
  }

  handleDurationChange(event) {
    this.setState({durationActive: event.target.value});
  }

  handleSwitchClick(event) {
    this.setState({categoryActive: event.target.value});
  }

  handleAmountChange(event) {
    let input = parseInt(event.target.value)
    if(Number.isNaN(input)) {
      input = ''
    }
    this.setState({amount: input});
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

  createUniqueId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  trackAction(trackingData) {
    if (this.state.tracker.trackingEnable && trackingData !== {}) {
        var gtmData = {'taxInterestCalculator': Object.assign(trackingData, this.fillTrackState())};
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
    }
  }

  fillTrackState() {
    return {
      'event': 'zinsrechner',
      'clientId': this.state.tracker.clientId,
      'amount': this.state.amount,
      'button': this.state.categoryActive,
      'duration': this.state.durationActive
    };
  }
}

function AmountInput(props) {
  return (
    <div>
      <label>Betrag
        <input type="text" name="dash-amount" className="dashboard-item-amount"
          id="dash-amount" maxLength="9" 
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onInputChange}
          />
      </label>
    </div>
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
    <div>
      <label>Laufzeit
        <select id="dash-maturity" name="dash-maturity" value={props.value} onChange={props.onSelectChange}>
          <option value="all" data-duration="all">Alle anzeigen</option>
          <option value="p.a." data-duration="p.a.">Tages-/Flexgeld</option>
          {options}
        </select>
      </label>
    </div>
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

function DisplayProps(props) {
  return (
    <code>{props.amount} | 
          {props.categoryActive} | 
          {props.durationActive}</code>
  );
}

export default TaxCalculator;
