import React from 'react'
import './Button.css'

class Button extends React.Component {
    labelButton(val) {
        switch (val) {
            case 'AC':
                return 'clear'
            case '=':
                return 'equals'
            case '.':
                return 'decimal'
            case 'x':
                return 'multiply'
            case '/':
                return 'divide'
            case '+':
                return 'add'
            case '-':
                return 'subtract'
            case '1':
                return 'one'
            case '2':
                return 'two'
            case '3':
                return 'three'
            case '4':
                return 'four'
            case '5':
                return 'five'
            case '6':
                return 'six'
            case '7':
                return 'seven'
            case '8':
                return 'eight'
            case '9':
                return 'nine'
            case '0':
                return 'zero'
            default:
                return this.props.name        
        }
    }


    render() {
        let name = this.labelButton(this.props.name)
        return (
            <button 
                id={name}
                className={"btn btn-" + name}
                value={this.props.name}
                onClick={this.props.clickHandler}>
                    {this.props.name}
            </button>
        )
    }
}

export default Button

