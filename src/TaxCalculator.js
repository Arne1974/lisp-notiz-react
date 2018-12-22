import React, { Component } from 'react';
import './TaxCalculator.scss';
import TaxCalculatorContent from './TaxCalculatorContent';

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
      tracker: {trackingEnable: false, clientId: this.createUniqueId()},
    }
    this.imports = {
      products: 'http://127.0.0.1:3030/json/products.json',
      schema: 'http://127.0.0.1:3030/json/anlageangebote_liste.json',
    }
    this.schema = []
    this.notToPromote = ['HSHNDEHH', 'CPLUDES1XXX']
    this.amountPlaceholder = '1.000 €'
    this.categories = ['both', 'flex', 'fixed']
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSwitchClick = this.handleSwitchClick.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
  }

  render() {
    return (
      <section className="TaxCalculator">
        <div className="TaxCalculator-header">
          <AmountInput value={this.state.amount} onInputChange={this.handleAmountChange} placeholder={this.amountPlaceholder} />
          <Buttons onButtonClick={this.handleSwitchClick} categoryActive={this.state.categoryActive} />
          <Duration durations={this.state.durations} value={this.state.durationActive} onSelectChange={this.handleDurationChange} />
        </div>
        {this.state.loading ? (
          <div className="loader">Loading... </div>
        ): (
          <TaxCalculatorContent 
          products={this.state.products} 
          amount={this.state.amount}
          categoryActive={this.state.categoryActive}
          durationActive={this.state.durationActive} />
        )}
        <TaxCalculatorFooter />
      </section>
    );
  }

  // Listener
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
  }
  handleSwitchClick(event) {
    const switchType = event.target.value
    if(switchType==='flex'){
      this.setState({ durationActive: 'p.a.' })
    }else if(switchType==='both' || switchType==='fixed'){
      this.setState({ durationActive: 'all' })
    }
    this.setState({ categoryActive: switchType })
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
        this.schema = values[1]
        this.setState({
          
          products: this.createContentFromImport(values[0]),
        })
      }
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
        item.pp = scope.buildProperties(item.productBankBic, item.productBankName, item.maturityCode)
        item.durationClear = <DurationClear duration={item.pp.duration} term={item.maturityCodeTerm} />
        item.abstractSortNumber = ((item.pp.sortNumber) ? item.pp.sortNumber : i)
        
        //Add up fixed-items to Maturity-Filter Array, if not allready in
        if ((this.state.durations).indexOf(item.pp.duration) === -1 && item.pp.duration!==undefined) {
          this.state.durations.push(item.pp.duration)
        }
        
        // items.push(item)
        items = items.concat(item)
      }
    });

    this.setState({
      loading: false,
    })

    // Sort Filter für Laufzeit und sämtliche Products
    this.state.durations.sort((a, b) => (a-b))
    return items.sort((a, b) => (a.abstractSortNumber - b.abstractSortNumber))
  }
  buildProperties(productBankBic, productBankName, maturityCode) {
    let settings = {
      'productBankCountry': 'tbd',
      'showTooltip': 'tbd',
      'urlAnlageangebot': 'https://www.example.org?params=/product/details/' + productBankBic + '/' + maturityCode,
      'productBankLogo': 'tbd',
      'sortNumber': 0,
      'descriptionHtml': '',
      'special': '',
      'duration': 12,
    };

    //Duration
    if (maturityCode.toLowerCase().indexOf('fixed') >= 0) {
      let term = maturityCode.split('_').pop(),
        patt = /[0-9]*/g,
        result = patt.exec(term);
      settings.duration = (term.toLowerCase().indexOf('m') >= 0) ? result[0] : result[0] * 12;
    }

    //Other
    let link = '', imageSrc = '';
    settings.showTooltip = 'Einlagen sind pro Kunde bis 100.000 EUR zu 100 % abgesichert.';

    if (productBankBic === 'HAABAT2K') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=csm_Anadi_Logo_192d674e89.png';
      link = '/#anadi';
      settings.productBankCountry = 'Österreich';
    } else if (productBankBic === 'BUCUROBU') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=logo_alpha_bank_160x34.png';
      link = '/#alpha';
      settings.productBankCountry = 'Rumänien';
    } else if (productBankBic === 'ATMBGB22') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=banklogo/atombank_logo.png';
      link = '/#atom';
      settings.productBankCountry = 'Großbritannien';
      settings.showTooltip = 'Einlagen sind pro Kunde bis 85.000 GBP zu 100 % abgesichert.';
    } else if (productBankBic === 'CBRLGB2L') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=Close_Brothers_Savings_Logo.png';
      link = '/#closebrothers';
      settings.productBankCountry = 'Großbritannien';
      settings.showTooltip = 'Einlagen sind pro Kunde bis 85.000 GBP zu 100 % abgesichert.';
    } else if (productBankBic === 'PARXLV22') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=Citadele_Logo_klein.jpg';
      link = '/#cbl';
      settings.productBankCountry = 'Lettland';
    } else if (productBankBic === 'CPLUDES1XXX') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=CP_Logo_transp_v2.png';
      link = '/#creditplus';
      settings.productBankCountry = 'Deutschland';
    } else if (productBankBic === 'FIMBMTM3XXX') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=csm_fimbank_730c9feb99.png';
      link = '/#fim';
      settings.productBankCountry = 'Malta';
    } else if (productBankBic === 'BACCFR22') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=oney_logo_klein.jpg';
      link = '/#oney';
      settings.productBankCountry = 'Frankreich';
    } else if (productBankBic === 'RTMBLV2X') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=RietumuLogo.gif';
      link = '/#rietumu';
      settings.productBankCountry = 'Lettland';
    } else if (productBankBic === 'BDIGPTPL') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=big_logo.png';
      link = '/#bigbank';
      settings.productBankCountry = 'Portugal';
    } else {
      imageSrc = 'https://via.placeholder.com/120x53';
      link = 'https://www.example.org/';
      settings.productBankCountry = 'Utopia';
    }
    settings.productBankLogo = <ProductBankLogo link={link} productBankName={productBankName} imageSrc={imageSrc} />

    //SortNumber
    this.schema.forEach((e) => {
      if (maturityCode === e.maturity && productBankBic === e.bic) {
        settings.sortNumber = e.sort_no;
        settings.descriptionHtml = <RenderDescription desc1={e.desc1} desc2={e.desc2} desc3={e.desc3} bonusurl={e.bonusurl} />

        if (e.special !== undefined && e.special !== '') {
          settings.announcement = <SpecialAnnouncement special={e.special} />
        }
      }
    });

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

function SpecialAnnouncement(props) {
  return (
    <div className="item-maturitycode-anouncement">{props.special}</div>
  );
}

function RenderDescription(props) {
  if (props.desc1 !== '') {
    let desc2 = props.desc2
    if (props.bonusurl !== undefined && props.bonusurl !== '') {
      desc2 = <KontoAktivierungsBonus link={props.bonusurl} description={props.desc2} />;
    }
    return (
      <ul className="description-text-list">
        <li>{props.desc1}</li>
        <li>{desc2}</li>
        <li>{props.desc3}</li>
      </ul>
    );
  }
}

function ProductBankLogo(props) {
  return (
    <a href={props.link} target="_blank" title={props.productBankName} rel="noopener noreferrer">
      <img src={props.imageSrc} alt={props.productBankName} />
    </a>
  );
}

function KontoAktivierungsBonus(props) {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">{props.description}</a>
  );
}

function DurationClear(props){
  if(props.duration === 12 && props.term === 'flex'){
    return (
      <span className="maturitycode-duration-wrapper">
        Tagesgeld/<br />Flexgeld
      </span>
    )
  } else {
    return (
      <span className="maturitycode-duration-wrapper">
        {props.duration} Monate
      </span>
    )
  }
}

export default TaxCalculator;
