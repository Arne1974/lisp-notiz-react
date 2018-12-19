import React, { Component } from 'react'

export class TaxCalculatorContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterList: [],
      children: [],
    }
  }

  render() {
    let children = []
    this.props.products.forEach((e, i) => {
      const pb = e.productBank,
        p = e.product,
        productBankBic = pb.bank.bic,
        productBankName = pb.name,
        maturityCode = p.maturityCode,
        usp = e.upcomingStartDates;

      if ((this.props.notToPromote).indexOf(productBankBic) === -1) {
        const pp = this.buildProperties(productBankBic, productBankName, maturityCode),
          maturityCodeTerm = ((maturityCode).toLowerCase().indexOf('fixed') >= 0) ? 'fixed' : 'flex',
          rates = this.buildRates(p.interestRateOverTime, usp, p.depositType),
          showRatePreview = (rates.previewRate) ? 'Ab ' + rates.previewClear + ': ' + rates.previewRate + ' %' : '',
          durationClear = (pp.duration === 12 && maturityCodeTerm === 'flex') ? 'Tagesgeld/<br>Flexgeld' : pp.duration + ' Monate',
          showAmountNote = (maturityCodeTerm === 'fixed') ? '' : ' p.a.',
          abstractSortNumber = ((pp.sortNumber) ? pp.sortNumber : i);

        children[abstractSortNumber] = <Child key={i} pp={pp} rates={rates} maturityCodeTerm={maturityCodeTerm} showRatePreview={showRatePreview} durationClear={durationClear} showAmountNote={showAmountNote} />

        //Add up fixed-items to Maturity-Filter Array, if not allready in
        if ((this.state.filterList).indexOf(pp.duration) === -1) {
          this.state.filterList.push(pp.duration);
        }
      }
    });

    return (
      <div className="TaxCalculator-content">
        {children}
      </div>
    )
  }

  componentDidMount() {
    this.state.filterList.sort(function (a, b) {
      return a - b
    });
    this.handleDurations()
  }

  handleDurations() {
    this.props.handleDurationsAddition(this.state.filterList)
  }

  buildProperties(productBankBic, productBankName, maturityCode) {
    let settings = {
      'duration': 12,
      'productBankCountry': 'tbd',
      'showTooltip': 'tbd',
      'urlAnlageangebot': 'https://www.example.org?params=/product/details/' + productBankBic + '/' + maturityCode,
      'productBankLogo': 'tbd',
      'sortNumber': 0,
      'descriptionHtml': '',
      'special': ''
    };

    //Duration
    if (maturityCode.toLowerCase().indexOf('fixed') >= 0) {
      var term = maturityCode.split('_').pop(),
        patt = /[0-9]*/g,
        result = patt.exec(term);
      settings.duration = (term.toLowerCase().indexOf('m') >= 0) ? result[0] : result[0] * 12;
    }

    //Other
    var link = '', imageSrc = '';
    settings.showTooltip = 'Einlagen sind pro Kunde bis 100.000 EUR zu 100 % abgesichert.';

    if (productBankBic === 'HAABAT2K') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=csm_Anadi_Logo_192d674e89.png';
      link = '/#anadi';
      settings.productBankCountry = '&Ouml;sterreich';
    } else if (productBankBic === 'BUCUROBU') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=logo_alpha_bank_160x34.png';
      link = '/#alpha';
      settings.productBankCountry = 'Rum&auml;nien';
    } else if (productBankBic === 'ATMBGB22') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=banklogo/atombank_logo.png';
      link = '/#atom';
      settings.productBankCountry = 'Gro&szlig;britannien';
      settings.showTooltip = 'Einlagen sind pro Kunde bis 85.000 GBP zu 100 % abgesichert.';
    } else if (productBankBic === 'CBRLGB2L') {
      imageSrc = 'https://via.placeholder.com/120x53?logo=Close_Brothers_Savings_Logo.png';
      link = '/#closebrothers';
      settings.productBankCountry = 'Gro&szlig;britannien';
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
    this.props.schema.forEach(function (e) {
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
    var rate = {}, d = new Date(),
      beforeTrancheEnd = (d.setDate(d.getDate() + 3));

    if (depositType === 'DIRECT_ACCESS') {
      r.forEach(function (e) {
        var realRate = e.rate,
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
        var realRate = e.rate,
          validFrom = new Date(e.validFrom);

        if (Date.parse(validFrom) < beforeTrancheEnd) {
          rate.rate = realRate;
          rate.ratesClear = (realRate * 100).toFixed(2).replace('.', ',');
        }
      });

      usp.forEach(function (e) {
        var realRate = e.rate,
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

function Child(props) {
  return (
    <ul className="calc-list-row" data-term={props.maturityCodeTerm}>
      <li className="calc-item-rate hidden-xs" data-rate={props.rates.rate}>{props.rates.ratesClear}&nbsp;%
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-maturitycode" data-duration={props.pp.duration}>
        {props.pp.announcement}
        <span className="maturitycode-duration-wrapper">{props.durationClear}</span>
        <div className="calc-sub-note hidden-xs">
          <span className="maturitycode-explain-text">Laufzeit</span>
        </div>
      </li>
      <li className="calc-item-productbankname">
        <span className="productbankname-logo-wrapper">{props.pp.productBankLogo}</span>
        <div className="calc-sub-note hidden-xs">
          <span className="logo-country-text" data-toggle="tooltip" data-placement="bottom" title={props.pp.showTooltip}>{props.pp.productBankCountry}</span>
        </div>
      </li>
      <li className="calc-item-rate visible-xs-block" data-rate={props.rates.rate}>
        <span className="rate-text-wrapper">{props.rates.ratesClear}&nbsp;%</span>
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-amount hidden-xs">
        <span className="calc-amount-price">0,00</span>
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
