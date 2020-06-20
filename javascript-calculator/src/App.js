import React from 'react';
import Keypad from './Keypad'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currVal: 0,
      prevVal: 0,
      prevOperator: '',
      storedVal: 0,
      lastPress: ''
    }
    this.receiveKey = this.receiveKey.bind(this)
  }

  receiveKey(val) {    
    val.match(/[-+/x]/) ? this.operatorPress(val)
    : val === '.' ? this.dotPress(val)
    : val === '=' ? this.equalsPress()
    : val === 'AC' ? this.reset() 
      : this.addToCurrVal(val)
    this.setState({lastPress: val})
  }

  reset() {
    this.setState((state, props) => {
      return {
        currVal: '0',
        prevOperator: '',
        prevVal: 0,
        storedVal: 0
      }
    })
  }

  addToCurrVal(val) {   
    this.setState((state, props) => {
      return state.currVal == '0' || state.prevOperator === '='
      ? {currVal: val}
      : {currVal: state.currVal + val}
    })
  }

  dotPress(key) {    
    if (this.state.currVal.indexOf('.') === -1) {      
      this.addToCurrVal(key)
    }
  }

  operatorPress(key) {
    // Handle input for negative numbers 
    if ((/-/).test(key) && this.state.currVal === 0) {
      this.addToCurrVal(key)
    } else if ((/[-+/x]/).test(this.state.lastPress)) {
      // Allow user to change the operator pressed
      this.replaceOperator(key)
    } else { 
      this.setState((state) => {
      return state.storedVal
          // Handle inputs after equals has been pressed
        ? {
          prevVal: state.storedVal,
          prevOperator: key,
          currVal: 0,
          storedVal: 0
          }
          // Move first number input to prevVal
        : !state.prevVal
        ? { prevVal: state.currVal, 
            prevOperator: key,
            currVal: 0
          }
        : { prevVal: this.calculate(state.prevVal, state.currVal, state.prevOperator).toString(), 
            prevOperator: key, 
            currVal: 0
          }
    })
    }
  }

  replaceOperator(key) {
    this.setState((state) => {
      return {
        prevVal: state.prevVal,
        currVal: 0,
        prevOperator: key
      }
    })
  }

  equalsPress() {
    this.setState((state) => (
      {
        storedVal: this.calculate(state.prevVal, state.currVal, state.prevOperator),
        prevVal: 0,
        currVal: '0',
        prevOperator: '='
      }
    ))
  }

  calculate(a, b, operator) {
    switch (operator) {
      case '+':
        return parseFloat(a) + parseFloat(b)
      case '-':
        return parseFloat(a) - parseFloat(b)
      case 'x':
        return parseFloat(a) * parseFloat(b)
      case '/':
        return parseFloat(a) / parseFloat(b)        
      default:
    }
  }

  render() {
    return (
      <main className="calculator-frame">
        <h1 className="brand">Weigel T2008</h1>
        <section id="display" className="display">
            <span>{
              this.state.storedVal !== 0 && this.state.currVal ==='0'
              ? this.state.storedVal.toString().slice(0, 11)
              : this.state.currVal.toString().slice(0, 11)
            }</span>
        </section>
        <Keypad  updateState={this.receiveKey} currVal={this.state.currVal} />
      </main>
    );
  }
}

export default App;
