import React from 'react'
import Button from './Button'
import './Keypad.css'

class Keypad extends React.Component {
    constructor(props) {
        super(props)
        this.clickHandler = this.clickHandler.bind(this)
    }

    clickHandler(ev) {       
        this.props.updateState(ev.target.value) 
    }

    render() {
        return(
            <section className="keypad">
                <Button name='AC' 
                    clickHandler={this.clickHandler}
                />
                <Button name='/' 
                    clickHandler={this.clickHandler}
                />
                <Button name='x' 
                    clickHandler={this.clickHandler}
                />
                <Button name='7' 
                    clickHandler={this.clickHandler}
                />
                <Button name='8' 
                    clickHandler={this.clickHandler}
                />
                <Button name='9' 
                    clickHandler={this.clickHandler}
                />
                <Button name='-' 
                    clickHandler={this.clickHandler}
                />
                <Button name='4' 
                    clickHandler={this.clickHandler}
                />
                <Button name='5' 
                    clickHandler={this.clickHandler}
                />
                <Button name='6' 
                    clickHandler={this.clickHandler}
                />
                <Button name='+' 
                    clickHandler={this.clickHandler}
                />
                <Button name='1' 
                    clickHandler={this.clickHandler}
                />
                <Button name='2' 
                    clickHandler={this.clickHandler}
                />
                <Button name='3' 
                    clickHandler={this.clickHandler}
                />
                <Button name='0' 
                    clickHandler={this.clickHandler}
                />
                <Button name='.' 
                    clickHandler={this.clickHandler}
                />
                <Button name='=' 
                    clickHandler={this.clickHandler}
                />
            </section>
        )
    }
}

export default Keypad