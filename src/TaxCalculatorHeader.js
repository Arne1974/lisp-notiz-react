import React, { Component } from 'react'

export class TaxCalculatorHeader extends Component {
  render() {
    return (
      <div className="TaxCalculator-header">
        <Amount value={this.props.amountPropsValue} onInputChange={this.props.amountPropsOnInputChange} placeholder={this.props.amountPropsPlaceholder} />
        <Buttons onButtonClick={this.props.buttonPropsOnButtonClick} categoryActive={this.props.buttonPropsCategoryActive} />
        <Duration durations={this.props.durationPropsDurations} value={this.props.durationPropsValue} onSelectChange={this.props.durationPropsOnSelectChange} />
      </div>
    )
  }
}

function Amount(props) {
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

export default TaxCalculatorHeader