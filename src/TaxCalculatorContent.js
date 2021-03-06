import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function TaxCalculatorContent(props) {
  const badges = props.products.map((e, i) => {
    return (
      <Badge 
        key={i} 
        product={e}
        amount={props.amount}
        handleLinkClick={props.handleLinkClick} />
      )
    }
  )

  return (
    <div className="TaxCalculator-content">
      { !props.error && props.products.length<1 ? <div className="calc-list-loading">Loading... </div> : badges }
      { props.error ? <pre className="calc-list-error">Es ist ein Fehler beim Laden des Dokuments aufgetreten! :(</pre> : '' }
    </div>
  )
}

// components
function Badge(props) {
  const amount = (!Number.isNaN(props.amount) && props.amount >= 0)? props.amount: 0
  
  // tooltip
  const tooltip = (
    <Tooltip id="logo-country-tooltip" className="logo-country-tooltip">
      {props.product.pp.showTooltip}
    </Tooltip>
  )
  
  return (
    <ul className="calc-list-row">
      <li className="calc-item-rate hidden-xs">{props.product.rates.ratesClear}&nbsp;%
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.product.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-maturitycode">
        <SpecialAnnouncement value={props.product.pp.specialAnnouncement.value} />
        <DurationClear duration={props.product.pp.duration} term={props.product.maturityCodeTerm} />
        <div className="calc-sub-note hidden-xs">
          <span className="maturitycode-explain-text">Laufzeit</span>
        </div>
      </li>
      <li className="calc-item-productbankname">
        <span className="productbankname-logo-wrapper">
        <ProductBankLogo 
          link={props.product.pp.link} 
          productBankName={props.product.productBankName} 
          imageSrc={props.product.pp.imageSrc} />
        </span>
        <div className="calc-sub-note hidden-xs">
          <OverlayTrigger placement="bottom" overlay={tooltip}>
            <span className="logo-country-text">{props.product.pp.productBankCountry}</span>
          </OverlayTrigger>
        </div>
      </li>
      <li className="calc-item-rate visible-xs-block">
        <span className="rate-text-wrapper">{props.product.rates.ratesClear}&nbsp;%</span>
        <div className="calc-sub-note">
          <span className="rate-explain-text">{props.product.showRatePreview}</span>
        </div>
      </li>
      <li className="calc-item-amount hidden-xs">
        <Price amount={amount} term={props.product.maturityCodeTerm} rate={props.product.rates.rate} duration={props.product.pp.duration} />
        <span className="calc-amount-currency">&euro;</span>
        <div className="calc-sub-note">
          <span className="amount-note-text">Zinsertrag {props.product.showAmountNote} <sup>*</sup></span>
        </div>
      </li>
      <li className="calc-item-description hidden-sm hidden-xs">
        <div className="item-description-text">
          <RenderDescription 
            desc1={props.product.pp.descriptionHtml.desc1} 
            desc2={props.product.pp.descriptionHtml.desc2} 
            desc3={props.product.pp.descriptionHtml.desc3} 
            bonusurl={props.product.pp.descriptionHtml.bonusurl} 
            handleLinkClick={props.handleLinkClick} />
          <div className="calc-sub-note">
            &nbsp;&nbsp;&nbsp;<a href={props.product.pp.urlAnlageangebot} onClick={props.handleLinkClick} target="_blank" className="item-description-anchor" rel="noopener noreferrer">Angebotsdetails</a>
          </div>
        </div>
      </li>
      <li className="calc-item-cta">
        <span className="cta-button-wrapper">
          <a href="https://www.example.org?params=/flows/register" onClick={props.handleLinkClick} target="_blank" className="btn btn-primary" rel="noopener noreferrer">Jetzt anlegen</a>
        </span>
        <div className="calc-sub-note hidden-lg hidden-md">
          <a href={props.product.pp.urlAnlageangebot} onClick={props.handleLinkClick} target="_blank" className="cta-more-text" rel="noopener noreferrer">Weitere Informationen</a>
        </div>
      </li>
    </ul>
  );
}

function Price(props) {
  return <span className="calc-amount-price">{calculate(props.term, props.amount, props.rate, props.duration)}</span>
}

function SpecialAnnouncement(props) {
  return (typeof props.value!=='undefined' && props.value!=='')? <div className="item-maturitycode-anouncement">{props.value}</div>: ''
}

function RenderDescription(props) {
  if (props.desc1 !== '') {
    let desc2 = props.desc2
    if (typeof props.bonusurl !== 'undefined' && props.bonusurl !== '') {
      desc2 = <KontoAktivierungsBonus link={props.bonusurl} description={props.desc2} handleLinkClick={props.handleLinkClick} />;
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
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAA1BAMAAAB4jDJTAAAAG1BMVEXMzMyWlpacnJzFxcWxsbGjo6Oqqqq+vr63t7dy4/Y7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAyElEQVQYGe3BwWrCQBRA0RvH1iwnPNJ2GUeLWY5i96FfEBBcD0WDyySlcV1B4me34A/MspR3Dkoppf6CBW+5T13F3SR7os89UbZCM9TdreQuuY0sh4IoThBjD1zhnQY2MCuwxBGCsSs2MBkF+nmAbU0cgcdaSCB9reB73DPLWuIIfHghAZwHQwdDQRzhYceKNTD3/EpMayxxhAYOXGG6D3CiT2tjiSOU57YbS1h/PsPlvDQvX4E4QpZJ6io4coSpC1xyj1JK/S8/sGgdQfkHonAAAAAASUVORK5CYII=" alt={props.productBankName} />
    </a>
  );
}

function KontoAktivierungsBonus(props) {
  return (
    <a href={props.link} onClick={props.handleLinkClick} target="_blank" rel="noopener noreferrer">{props.description}</a>
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

// pure functions
function calculate(term, amount, rate, duration){
  if (term === 'fixed'){
    return ((amount * rate) / 12 * duration).toFixed(2).replace('.', ',');
  } else if(term === 'flex'){
    return ((amount * rate)).toFixed(2).replace('.', ',')
  }
}

export default TaxCalculatorContent
