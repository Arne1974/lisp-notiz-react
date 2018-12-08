import React, { Component } from 'react'

export class TaxCalculatorContent extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
    render() {
        console.log(this.props.products);
        console.log(this.props.schema);

        return (
            <div className="TaxCalculator-content">
                <div>a</div>
                <div>b</div>
                <div>c</div>
            </div>
        )
    }
}

export default TaxCalculatorContent
