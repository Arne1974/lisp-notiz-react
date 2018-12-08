import React, { Component } from 'react'

export class TaxCalculatorHeader extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
    render() {
        return (
            <div className="TaxCalculator-header">
                <div>Betrag</div>
                <div></div>
                <div>Laufzeit</div>
            </div>
        )
    }
}

export default TaxCalculatorHeader
