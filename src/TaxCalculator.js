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
      durations: [],
      amount: 1000,
      categoryActive: 'both',
      durationActive: 'all',
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
          <TaxCalculatorContent 
            products={products} 
            schema={schema} 
            amount={this.state.amount}
            categoryActive={this.state.categoryActive}
            durationActive={this.state.durationActive} />
          <TaxCalculatorFooter />
        </section>
      );
    }
  }

  // Listener
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
          (response) => {
            return response.json();
          }
        ),
      fetch(this.imports.schema)
        .then(
          (response) => {
            return response.json();
          }
        )
    ]).then(
      (values) => {
        this.setState({
          loading: false,
          schema: values[1],
          products: this.createContentFromImport(values[0]),
        })
      }
    );
  }

  createContentFromImport(importProducts) {
    const scope = this
    return importProducts.map((e) => {
      let item = {
        pb: e.productBank,
        p: e.product,
        productBankBic: e.productBank.bank.bic,
        productBankName: e.productBank.name,
        maturityCode: e.product.maturityCode,
        usp: e.upcomingStartDates,
      }

      if ((this.notToPromote).indexOf(item.productBankBic) === -1) {

        item.maturityCodeTerm = ((item.maturityCode).toLowerCase().indexOf('fixed') >= 0) ? 'fixed' : 'flex'
        item.rates = scope.buildRates(e.product.interestRateOverTime, item.usp, e.product.depositType)
        item.showRatePreview = (item.rates.previewRate) ? 'Ab ' + item.rates.previewClear + ': ' + item.rates.previewRate + ' %' : ''
        item.showAmountNote = (item.maturityCodeTerm === 'fixed') ? '' : ' p.a.'
        item.pp = {
          duration: scope.getDuration(item.maturityCode),
        }
        
        // const pp = this.buildProperties(productBankBic, productBankName, maturityCode),
          // durationClear = <DurationClear duration={pp.duration} term={maturityCodeTerm} />,
          // abstractSortNumber = ((pp.sortNumber) ? pp.sortNumber : i);
        
        //Add up fixed-items to Maturity-Filter Array, if not allready in
        if ((this.state.durations).indexOf(item.pp.duration) === -1 && item.pp.duration!==undefined) {
          this.state.durations.push(item.pp.duration)
        }
      }
      this.state.durations.sort((a, b) => (a-b))
      return item
    });
  }
  getDuration(maturityCode) {
    if (maturityCode.toLowerCase().indexOf('fixed') >= 0) {
      let term = maturityCode.split('_').pop(),
        patt = /[0-9]*/g,
        result = patt.exec(term);
      return (term.toLowerCase().indexOf('m') >= 0) ? result[0] : result[0] * 12;
    }
  }
  buildRates(r, usp, depositType) {
    let rate = {}, d = new Date(),
      beforeTrancheEnd = (d.setDate(d.getDate() + 3));

    if (depositType === 'DIRECT_ACCESS') {
      r.forEach(function (e) {
        let realRate = e.rate,
          validFrom = new Date(e.validFrom);

        if (Date.parse(validFrom) < beforeTrancheEnd) {
          rate.rate = realRate;
          rate.ratesClear = (realRate * 100).toFixed(2).replace('.', ',');
        } else {
          if (rate.previewRate === undefined) {
            rate.previewRate = (realRate * 100).toFixed(2).replace('.', ',');
            rate.previewClear = validFrom.getDate() + '.' + (validFrom.getMonth() + 1) + '.';
          }
        }
      });
    } else {
      r.forEach(function (e) {
        let realRate = e.rate,
          validFrom = new Date(e.validFrom);

        if (Date.parse(validFrom) < beforeTrancheEnd) {
          rate.rate = realRate;
          rate.ratesClear = (realRate * 100).toFixed(2).replace('.', ',');
        }
      });

      usp.forEach(function (e) {
        let realRate = e.rate,
          startDate = new Date(e.startDate);

        if (rate.rate !== realRate) {
          if (rate.previewRate === undefined) {
            rate.previewRate = (realRate * 100).toFixed(2).replace('.', ',');
            rate.previewClear = startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.';
          }
        }
      });
    }
    return rate;
  }

  // Tracker
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
    <div className="hidden-xs">
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
    <div className="hidden-xs">
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

export default TaxCalculator;
