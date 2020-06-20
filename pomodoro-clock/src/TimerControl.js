import React from 'react'

class TimerControl extends React.Component {
    render() {
        return(
            <i id={this.props.name} 
                className={`clock-controls-icon ${this.props.icon}`}
                onClick={this.props.clickHandler}
            >
            </i>
        )
    }
}

export default TimerControl