import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorHeader from './TaxCalculatorHeader';
import TaxCalculatorContent from './TaxCalculatorContent';
import TaxCalculatorFooter from './TaxCalculatorFooter';
import bankModule from './TaxCalculatorBankModule';

class TaxCalculator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      products: [],
      durations: [],
      amount: 1000,
      categoryActive: 'both',
      durationActive: 'all',
      error: false,
    }
    this.imports = {
      products: 'http://127.0.0.1:3030/json/products.json',
      schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
    }
    this.schema = []
    this.notToPromote = ['HSHNDEHH', 'CPLUDES1XXX']
    this.amountPlaceholder = '1.000 €'
    this.categories = ['both', 'flex', 'fixed']
    this.tracker = { trackingEnable: false, clientId: this.createUniqueId() }
    
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
    this.handleLinkClick = this.handleLinkClick.bind(this)
  }

  render() {
    return (
      <section className="TaxCalculator">
        <TaxCalculatorHeader
          amountPropsValue={this.state.amount} amountPropsOnInputChange={this.handleAmountChange} amountPropsPlaceholder={this.amountPlaceholder}
          buttonPropsOnButtonClick={this.handleSwitchClick} buttonPropsCategoryActive={this.state.categoryActive}
          durationPropsDurations={this.state.durations} durationPropsValue={this.state.durationActive} durationPropsOnSelectChange={this.handleDurationChange} />
        { this.state.loading ? <div className="loader">Loading... </div> : '' }
        <TaxCalculatorContent 
          error={this.state.error}
          products={this.state.products} 
          amount={this.state.amount}
          categoryActive={this.state.categoryActive}
          durationActive={this.state.durationActive}
          handleLinkClick={this.handleLinkClick} />
        <TaxCalculatorFooter />
      </section>
    );
  }

  // Listener
  handleLinkClick(event) {
    event.stopPropagation();
    this.trackAction({
      trigger: 'LinkClick',
      url: event.target.href,
    })
  }
  handleDurationChange(event) {
    const switchType = event.target.value
    if(switchType==='p.a.'){
      this.setState({ categoryActive: 'flex' })
    }else if(switchType==='all'){
      this.setState({ categoryActive: 'both' })
    }else{
      this.setState({ categoryActive: 'fixed' })
    }
    this.setState({ durationActive: switchType })
    this.trackAction({
      trigger: 'DurationChange'
    })
  }
  handleSwitchClick(event) {
    const switchType = event.target.value
    if(switchType==='flex'){
      this.setState({ durationActive: 'p.a.' })
    }else if(switchType==='both' || switchType==='fixed'){
      this.setState({ durationActive: 'all' })
    }
    this.setState({ categoryActive: switchType })
    this.trackAction({
      trigger: 'SwitchClick'
    })
  }
  handleAmountChange(event) {
    let input = parseInt(event.target.value)
    if(Number.isNaN(input)) {
      input = ''
    }
    this.setState({amount: input});
    this.trackAction({
      trigger: 'AmountChange'
    })
  }
  
  componentDidMount() {
    Promise.all([
      fetch(this.imports.products)
        .then(
          response => {
            return response.json();
          }
        ),
      fetch(this.imports.schema)
        .then(
          response => {
            return response.json();
          }
        )
    ]).then(
      values => {
        this.schema = values[1]
        this.setInitParameter()
        this.setState({
          products: this.createContentFromImport(values[0]),
        })
        delete this.schema
      }
    ).catch(
      error => {
        this.setState({
          error: true
        })
        console.warn(error)
      }
    ).finally(
      () => this.setState({ loading: false })
    );
  }

  createContentFromImport(importProducts) {
    const scope = this
    let items = []
    importProducts.forEach((e, i) => {

      if ((this.notToPromote).indexOf(e.productBank.bank.bic) === -1) {
        let item = {
          pb: e.productBank,
          p: e.product,
          productBankBic: e.productBank.bank.bic,
          productBankName: e.productBank.name,
          maturityCode: e.product.maturityCode,
          usp: e.upcomingStartDates,
        }

        item.maturityCodeTerm = ((item.maturityCode).toLowerCase().indexOf('fixed') >= 0) ? 'fixed' : 'flex'
        item.rates = scope.buildRates(e.product.interestRateOverTime, item.usp, e.product.depositType)
        item.showRatePreview = (item.rates.previewRate) ? 'Ab ' + item.rates.previewClear + ': ' + item.rates.previewRate + ' %' : ''
        item.showAmountNote = (item.maturityCodeTerm === 'fixed') ? '' : ' p.a.'
        item.pp = scope.buildProperties(item.productBankBic, item.maturityCode)
        item.abstractSortNumber = ((item.pp.sortNumber) ? item.pp.sortNumber : i)
        
        //Add up fixed-items to Maturity-Filter Array, if not allready in
        if ((this.state.durations).indexOf(item.pp.duration) === -1 && item.pp.duration!==undefined) {
          this.state.durations.push(item.pp.duration)
        }
        
        items.push(item)
      }
    });
    
    // Sort Filter für Laufzeit und sämtliche Products
    this.state.durations.sort((a, b) => (a-b))
    return items.sort((a, b) => (a.abstractSortNumber - b.abstractSortNumber))
  }
  buildProperties(productBankBic, maturityCode) {
    let settings = {
      productBankCountry: 'Utopia',
      showTooltip: 'Einlagen sind pro Kunde bis 100.000 EUR zu 100 % abgesichert.',
      urlAnlageangebot: 'https://www.example.org?params=/product/details/' + productBankBic + '/' + maturityCode,
      sortNumber: 0,
      descriptionHtml: {},
      specialAnnouncement: {},
      duration: 12,
      imageSrc: 'https://via.placeholder.com/120x53',
      link: 'https://www.example.org/',
    };

    //Duration
    if (maturityCode.toLowerCase().indexOf('fixed') >= 0) {
      let term = maturityCode.split('_').pop(),
        patt = /[0-9]*/g,
        result = patt.exec(term);
      settings.duration = (term.toLowerCase().indexOf('m') >= 0) ? result[0] : result[0] * 12;
    }

    //Other
    settings = Object.assign(settings, this.getBankFromBic(productBankBic), this.getDataFromSchema(maturityCode, productBankBic))
    
    return settings;
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
  getBankFromBic(value=''){
    const newArray = bankModule.filter(e => e.productBankBic === value)
    return newArray[0].data
  }
  getDataFromSchema(maturityCode, productBankBic){
    const items = this.schema.filter((e) => {
      if (maturityCode === e.maturity && productBankBic === e.bic) {
        return true
      }
      return false
    });
    
    let item = {
      sortNumber: items[0].sort_no,
      descriptionHtml: {
        desc1: items[0].desc1,
        desc2: items[0].desc2,
        desc3: items[0].desc3,
        bonusurl: items[0].bonusurl,
      }
    }

    if (items[0].special !== undefined && items[0].special !== '') {
      item.specialAnnouncement = {
        value: items[0].special,
      }
    }
    
    return item
  }

  // Tracker
  createUniqueId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  trackAction(trackingData={}) {
    if (this.tracker.trackingEnable && trackingData) {
        let gtmData = {'taxInterestCalculator': Object.assign(trackingData, this.fillTrackState())};
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
    }
  }
  fillTrackState() {
    return {
      'event': 'zinsrechner',
      'clientId': this.tracker.clientId,
      'amount': this.state.amount,
      'button': this.state.categoryActive,
      'duration': this.state.durationActive
    };
  }

  // Init
  setInitParameter() {
    let searchTerm = document.URL.split('#').pop()
    
    if (searchTerm !== undefined) {
      const mayHaveDuration = searchTerm.split('-').pop()
      searchTerm = mayHaveDuration.length!==undefined ? searchTerm.split('-').shift(): searchTerm
      if (searchTerm.toLowerCase() === 'festgeld') {
        this.setState({
          categoryActive: 'fixed',
        })
        if(!isNaN(mayHaveDuration)){
          this.setState({
            durationActive: mayHaveDuration
          })
        }
      } else if (searchTerm.toLowerCase() === 'tagesgeld' || searchTerm.toLowerCase() === 'flexgeld' || searchTerm.toLowerCase() === 'flexgeld24') {
        this.setState({
          categoryActive: 'flex',
          durationActive: 'p.a.',
        })
      }
    }
  }
}

export default TaxCalculator;
