import React, { Component } from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

export class TaxCalculatorContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      badges: [],
    }
  }

  render() {
    let badges = this.state.badges
    badges.sort((a, b) => (a.sort_no - b.sort_no))

    return (
      <div className="TaxCalculator-content">
        {badges}
      </div>
    )
  }

  componentDidMount() {
    this.generateContent()
  }
  generateContent() {
    console.log(this.props.schema)
    
    this.props.products.forEach((e, i) => {
      console.log(e)
      const pp = this.buildProperties(e.productBankBic, e.productBankName, e.maturityCode),
          durationClear = <DurationClear duration={pp.duration} term={e.maturityCodeTerm} />,
          abstractSortNumber = ((pp.sortNumber) ? pp.sortNumber : i);
      console.log(pp)

        // //categoryActive + durationActive
        // if(this.props.categoryActive === 'both' && this.props.durationActive === 'all'){
        //   // console.log('Here')
        // }
        // // console.log(props.maturityCodeTerm) // fixed|flex
        // // console.log(props.pp.duration)  //1,2,3
        // console.log(maturityCodeTerm, pp.duration, this.props.durationActive)
        // const durationActive = ()=> (this.props.durationActive==='p.a.'? 12: this.props.durationActive).toString()

        // if(durationActive!=='all'){

        // }else{

        // }

        // if(pp.duration.toString()===durationActive.toString()){
        //   console.log('Duration matched!')
        // }
        // if(maturityCodeTerm===this.props.categoryActive){
        //   console.log('Category matched!')
        // }
        // badges[abstractSortNumber] = <Badge key={i} pp={pp} rates={rates} maturityCodeTerm={maturityCodeTerm} 
        //                                 showRatePreview={showRatePreview} durationClear={durationClear} 
        //                                 showAmountNote={showAmountNote} amount={this.props.amount}
        //                                 categoryActive={this.props.categoryActive}
        //                                 durationActive={this.props.durationActive} />
      
    });
  }
  buildProperties(productBankBic, productBankName, maturityCode) {
    let settings = {
      'productBankCountry': 'tbd',
      'showTooltip': 'tbd',
      'urlAnlageangebot': 'https://www.example.org?params=/product/details/' + productBankBic + '/' + maturityCode,
      'productBankLogo': 'tbd',
      'sortNumber': 0,
      'descriptionHtml': '',
      'special': ''
    };

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
    this.props.schema.forEach((e) => {
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
}

function KontoAktivierungsBonus(props) {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">{props.description}</a>
  );
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

function Badge(props) {
  const amount = (!isNaN(props.amount) && props.amount >= 0)? props.amount: 0
  const rate = props.rates.rate
  const duration = props.pp.duration
  const term = props.maturityCodeTerm
  let calculatedAmount

  if (term === 'fixed'){
    calculatedAmount = ((amount * rate) / 12 * duration).toFixed(2).replace('.', ',');
  } else if(term === 'flex'){
    calculatedAmount = ((amount * rate)).toFixed(2).replace('.', ',')
  }

  const tooltip = (
    <Tooltip id="logo-country-tooltip">
      {props.pp.showTooltip}
    </Tooltip>
  )

  return (
    <ul className="calc-list-row" data-term={props.maturityCodeTerm}>
      <li className="calc-item-rate hidden-xs" data-rate={props.rates.rate}>{props.rates.ratesClear}&nbsp;%
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-maturitycode" data-duration={props.pp.duration}>
        {props.pp.announcement}
        {props.durationClear}
        <div className="calc-sub-note hidden-xs">
          <span className="maturitycode-explain-text">Laufzeit</span>
        </div>
      </li>
      <li className="calc-item-productbankname">
        <span className="productbankname-logo-wrapper">{props.pp.productBankLogo}</span>
        <div className="calc-sub-note hidden-xs">
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <span className="logo-country-text">{props.pp.productBankCountry}</span>
          </OverlayTrigger>
        </div>
      </li>
      <li className="calc-item-rate visible-xs-block" data-rate={props.rates.rate}>
        <span className="rate-text-wrapper">{props.rates.ratesClear}&nbsp;%</span>
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-amount hidden-xs">
        <span className="calc-amount-price">{calculatedAmount}</span>
        <span className="calc-amount-currency">&euro;</span>
        <div className="calc-sub-note">
          <span className="amount-note-text">Zinsertrag {props.showAmountNote} <sup>*</sup></span>
        </div>
      </li>
      <li className="calc-item-description hidden-sm hidden-xs">
        <div className="item-description-text">
          {props.pp.descriptionHtml}
          <div className="calc-sub-note">
            &nbsp;&nbsp;&nbsp;<a href={props.pp.urlAnlageangebot} target="_blank" className="item-description-anchor" rel="noopener noreferrer">Angebotsdetails</a>
          </div>
        </div>
      </li>
      <li className="calc-item-cta">
        <span className="cta-button-wrapper">
          <a href="https://www.example.org?params=/flows/register" target="_blank" className="btn btn-primary" rel="noopener noreferrer">Jetzt anlegen</a>
        </span>
        <div className="calc-sub-note hidden-lg hidden-md">
          <a href={props.pp.urlAnlageangebot} target="_blank" className="cta-more-text" rel="noopener noreferrer">Weitere Informationen</a>
        </div>
      </li>
    </ul>
  );
}

export default TaxCalculatorContent
