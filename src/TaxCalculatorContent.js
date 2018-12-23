import React from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

function TaxCalculatorContent(props) {
  const badges = props.products.map((e, i) => {
    return (
      <Badge 
        key={i} 
        product={e}
        amount={props.amount}
        categoryActive={props.categoryActive}
        durationActive={props.durationActive} />
      )
    }
  )

  return (
    <div className="TaxCalculator-content">
      {badges}
    </div>
  )
}

function Badge(props) {
  const amount = (!isNaN(props.amount) && props.amount >= 0)? props.amount: 0
  const rate = props.product.rates.rate
  const duration = props.product.pp.duration
  const term = props.product.maturityCodeTerm
  
  const durationActive = props.durationActive==='p.a.' ? 12: props.durationActive
  const categoryActive = props.categoryActive
  
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

  let hiddenClass
  if(props.product.pp.duration.toString() === durationActive.toString()){
    if(props.product.maturityCodeTerm === categoryActive.toString()){
      hiddenClass = 'calc-list-row'
    }else{
      hiddenClass = 'calc-list-row hidden'
    }
  }else{
    if(categoryActive==='both'){
      hiddenClass = 'calc-list-row'
    }else if(categoryActive==='fixed'){
      if(durationActive.toString() === 'all'){
        if(props.product.maturityCodeTerm === categoryActive.toString()){
          hiddenClass = 'calc-list-row'
        }else{
          hiddenClass = 'calc-list-row hidden'
        }
      }else{
        if(props.product.pp.duration.toString() === durationActive.toString()){
          hiddenClass = 'calc-list-row'
        }else{
          hiddenClass = 'calc-list-row hidden'
        }
      }
    }else{
      hiddenClass = 'calc-list-row hidden'
    }
  }
  
  return (
    <ul className={hiddenClass} data-term={props.product.maturityCodeTerm}>
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
