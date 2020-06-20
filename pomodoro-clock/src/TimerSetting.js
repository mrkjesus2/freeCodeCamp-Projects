import React from 'react'

class TimerSetting extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(ev) {
        let type = ev.target.id.split('-')[1]
        let setting = ev.target.id.split('-')[0]
        
        type && type === 'increment'
        ? this.props.inc(setting, this.props.value)
        : this.props.dec(setting, this.props.value)
    }

    render() {
        let name = this.props.name
        // console.log(name)
        return (
            <section className="clock-setting">
                <h3 id={`${name}-label`} 
                    className="clock-setting-label">
                        {`${name} Length`}
                </h3>
                <div className="clock-setting-content">
                    <i id={`${name}-decrement`}
                        className="fas fa-arrow-down"
                        onClick={this.handleClick}
                    >
                    </i>
                    <span id={`${name}-length`}>
                        {this.props.value/60}
                    </span>
                    <i id={`${name}-increment`}
                        className="fas fa-arrow-up"
                        onClick={this.handleClick}
                    >
                    </i>
                </div>
            </section>
        )
    }
}

export default TimerSetting