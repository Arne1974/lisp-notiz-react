import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorHeader from './TaxCalculatorHeader';
import TaxCalculatorContent from './TaxCalculatorContent';
import TaxCalculatorFooter from './TaxCalculatorFooter';
import { BANK_MODULE } from './api';

class TaxCalculator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      durations: [],
      error: false,
      amount: 1000,
      products: [],

      categoryActive: 'both',
      durationActive: 'all',
    }
    
    this.schema = []
    this.allProducts = []
    this.imports = {
      products: 'http://127.0.0.1:3030/json/products.json',
      schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
    }
    
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
        <TaxCalculatorContent 
          error={this.state.error}
          products={this.state.products} 
          amount={this.state.amount}
          handleLinkClick={this.handleLinkClick} />
        <TaxCalculatorFooter />
      </section>
    );
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
        this.allProducts = this.createContentFromImport(values[0])
        console.log('First.')
      }
    ).catch(
      error => {
        this.setState({
          error: true
        })
        console.warn(error)
      }
    ).finally(
      () => {
        this.schema = []
        const prods = this.getProductsWithAppliedFilter(this.state.durationActive, this.state.categoryActive)
        this.setState({ products: prods })
        console.log('Finally.')
      }
    );
  }

  // Listener
  handleLinkClick(event) {
    event.stopPropagation()
    this.trackAction({ trigger: 'LinkClick', url: event.target.href })
  }
  handleAmountChange(event) {
    let input = parseInt(event.target.value)
    if(isNaN(input)) {
      input = ''
    }
    this.setState({ amount: input })

    this.trackAction({ trigger: 'AmountChange' })
  }
  handleDurationChange(event) {
    const switchType = event.target.value
    let active 
    if(switchType==='p.a.'){
      active = 'flex'
    }else if(switchType==='all'){
      active = 'both'
    }else{
      active = 'fixed'
    }
    const prods = this.getProductsWithAppliedFilter(switchType, active)

    this.setState({
      categoryActive: active,
      durationActive: switchType,
      products: prods,
    })

    this.trackAction({ trigger: 'DurationChange' })
  }
  handleSwitchClick(event) {
    const switchType = event.target.value
    let active
    if(switchType==='flex'){
      active = 'p.a.'
    }else if(switchType==='both' || switchType==='fixed'){
      active = 'all'
    }
    const prods = this.getProductsWithAppliedFilter(active, switchType)

    this.setState({
      durationActive: active,
      categoryActive: switchType,
      products: prods
    })

    this.trackAction({ trigger: 'SwitchClick' })
  }
  
  // Runtime
  getProductsWithAppliedFilter(durationActive, categoryActive) {
    console.log('getProductsWithAppliedFilter: ', this.allProducts)
    if(durationActive === 'p.a.'){
      durationActive = 12
    }
    
    // const categoryActive = this.state.categoryActive
    console.log(durationActive, categoryActive)

    const prods = this.allProducts.filter((e) => {
      if(e.pp.duration.toString() === durationActive.toString()){
        if(e.maturityCodeTerm === categoryActive.toString()){
          return true
        }
      }else{
        if(categoryActive==='both'){
          return true
        }else if(categoryActive==='fixed'){
          if(durationActive.toString() === 'all'){
            if(e.maturityCodeTerm === categoryActive.toString()){
              return true
            }
          }else{
            if(e.pp.duration.toString() === durationActive.toString()){
              return true
            }
          }
        }
      }

      return false
    })

    console.log('Output:', prods)
    return prods
  }

  // Initialize
  setInitParameter() {
    // e.g. use: #festgeld, #festgeld-12, #tagesgeld
    let searchTerm = document.URL.split('#').pop()
    
    if (typeof searchTerm !== 'undefined') {
      const mayHaveDuration = searchTerm.split('-').pop()
      searchTerm = typeof mayHaveDuration.length!=='undefined' ? searchTerm.split('-').shift(): searchTerm
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
  createContentFromImport(importedProducts) {
    const scope = this
    let items = []
    importedProducts.forEach((e, i) => {

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
        if ((this.state.durations).indexOf(item.pp.duration) === -1 && typeof item.pp.duration!=='undefined') {
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
          if (typeof rate.previewRate === 'undefined') {
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
          if (typeof rate.previewRate === 'undefined') {
            rate.previewRate = (realRate * 100).toFixed(2).replace('.', ',');
            rate.previewClear = startDate.getDate() + '.' + (startDate.getMonth() + 1) + '.';
          }
        }
      });
    }
    return rate;
  }
  getBankFromBic(value=''){
    const newArray = BANK_MODULE.find(e => e.productBankBic === value)
    return newArray.data
  }
  getDataFromSchema(maturityCode, productBankBic){
    const item = this.schema.find(e => maturityCode === e.maturity && productBankBic === e.bic);
    let setting = {
      sortNumber: item.sort_no,
      descriptionHtml: {
        desc1: item.desc1,
        desc2: item.desc2,
        desc3: item.desc3,
        bonusurl: item.bonusurl,
      }
    }

    if (typeof item.special !== 'undefined' && item.special !== '') {
      setting.specialAnnouncement = { value: item.special }
    }
    return setting
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
}

export default TaxCalculator;
