import React, { Component } from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

export class TaxCalculatorContent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    console.log(this.props.products)
    const badges = this.props.products.map((e, i) => {
        return (
          <Badge 
            key={i} 
            product={e}
            amount={this.props.amount}
            categoryActive={this.props.categoryActive}
            durationActive={this.props.durationActive} />
        )
      }
    )

    return (
      <div className="TaxCalculator-content">
        {badges}
      </div>
    )
  }
  generateContent() {
    // console.log(this.props.schema)
    
    // this.props.products.forEach((e, i) => {
    //   console.log(e)
    //   const pp = this.buildProperties(e.productBankBic, e.productBankName, e.maturityCode),
    //       durationClear = <DurationClear duration={pp.duration} term={e.maturityCodeTerm} />,
    //       abstractSortNumber = ((pp.sortNumber) ? pp.sortNumber : i);
    //   console.log(pp)

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
      
    // });
  }
}

// function Badges(props) {
//   console.log(props)
  
//   return (
    
//   )
// }

function Badge(props) {
  console.log('Here', props.product)
  const amount = (!isNaN(props.amount) && props.amount >= 0)? props.amount: 0
  const rate = props.product.rates.rate
  const duration = props.product.pp.duration
  const term = props.product.maturityCodeTerm
  let calculatedAmount

  if (term === 'fixed'){
    calculatedAmount = ((amount * rate) / 12 * duration).toFixed(2).replace('.', ',');
  } else if(term === 'flex'){
    calculatedAmount = ((amount * rate)).toFixed(2).replace('.', ',')
  }

  const tooltip = (
    <Tooltip id="logo-country-tooltip">
      {props.product.pp.showTooltip}
    </Tooltip>
  )

  return (
    <ul className="calc-list-row" data-term={props.product.maturityCodeTerm}>
      <li className="calc-item-rate hidden-xs" data-rate={props.product.rates.rate}>{props.product.rates.ratesClear}&nbsp;%
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.product.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-maturitycode" data-duration={props.product.pp.duration}>
        {props.product.pp.announcement}
        {props.product.durationClear}
        <div className="calc-sub-note hidden-xs">
          <span className="maturitycode-explain-text">Laufzeit</span>
        </div>
      </li>
      <li className="calc-item-productbankname">
        <span className="productbankname-logo-wrapper">{props.product.pp.productBankLogo}</span>
        <div className="calc-sub-note hidden-xs">
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <span className="logo-country-text">{props.product.pp.productBankCountry}</span>
          </OverlayTrigger>
        </div>
      </li>
      <li className="calc-item-rate visible-xs-block" data-rate={props.product.rates.rate}>
        <span className="rate-text-wrapper">{props.product.rates.ratesClear}&nbsp;%</span>
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.product.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-amount hidden-xs">
        <span className="calc-amount-price">{calculatedAmount}</span>
        <span className="calc-amount-currency">&euro;</span>
        <div className="calc-sub-note">
          <span className="amount-note-text">Zinsertrag {props.product.showAmountNote} <sup>*</sup></span>
        </div>
      </li>
      <li className="calc-item-description hidden-sm hidden-xs">
        <div className="item-description-text">
          {props.product.pp.descriptionHtml}
          <div className="calc-sub-note">
            &nbsp;&nbsp;&nbsp;<a href={props.product.pp.urlAnlageangebot} target="_blank" className="item-description-anchor" rel="noopener noreferrer">Angebotsdetails</a>
          </div>
        </div>
      </li>
      <li className="calc-item-cta">
        <span className="cta-button-wrapper">
          <a href="https://www.example.org?params=/flows/register" target="_blank" className="btn btn-primary" rel="noopener noreferrer">Jetzt anlegen</a>
        </span>
        <div className="calc-sub-note hidden-lg hidden-md">
          <a href={props.product.pp.urlAnlageangebot} target="_blank" className="cta-more-text" rel="noopener noreferrer">Weitere Informationen</a>
        </div>
      </li>
    </ul>
  );
}

export default TaxCalculatorContent
