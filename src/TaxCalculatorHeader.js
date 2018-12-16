import React, { Component } from 'react'

export class TaxCalculatorHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: this.props.amount,
    }
    this.handleAmountChange = this.handleAmountChange.bind(this)
  }
  
  handleAmountChange(event) {
    event.preventDefault();
    console.log(event)
    this.setState({amount: event.target.value});
  }

  render() {
    const durationTemplate = this.buildDuration(this.props.durations);
    const amount = this.state.amount;

    return (
      <div className="TaxCalculator-header">
        <div>
          <label>Betrag
            <AmountInput value={amount} onInputChange={this.handleAmountChange} />
          </label>
        </div>
        <div>
          <button onClick={this.handleClick} className="btn btn-switch active" id="all-btn" value="1">alle Angebote</button>
          <button className="btn btn-switch" id="flex-btn">Tagesgeld</button>
          <button className="btn btn-switch" id="fixed-btn">Festgeld</button>
        </div>
        <div>
          <label>Laufzeit
            {durationTemplate}
          </label>
        </div>
      </div>
    )
  }

  buildDuration(durations=[]) {
    let options = durations.map((v, i)=> {
      return (<DurationOption duration={v} key={i} />)
    })

    return (
      <select id="dash-maturity" name="dash-maturity">
        <option value="all" data-duration="all">Alle anzeigen</option>
        <option value="p.a." data-duration="p.a.">Tages-/Flexgeld</option>
        {options}
      </select>
    );
  }
}

function AmountInput(props) {
  
  return (
    <input type="text" name="dash-amount" className="dashboard-item-amount"
      id="dash-amount" maxLength="9" placeholder="Summe eingeben"
      value={props.value}
      onChange={props.onInputChange}
       />
  );
}

function DurationOption(props) {
  let month = props.duration>1? ' Monate': ' Monat'
  return (
    <option value={props.duration} data-duration={props.duration}>{props.duration}{month}</option>
  )
}

export default TaxCalculatorHeader
