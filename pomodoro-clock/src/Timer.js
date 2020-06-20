import React from 'react'

class Timer extends React.Component {
    render() {
        let minutes = Math.floor(this.props.time/60)
        let seconds = this.props.time%60 

        return (
            <section className="clock-timer">
                <h2 id="timer-label" className="clock-timer-label">
                    {this.props.type}
                </h2>
                <p id="time-left" className="clock-timer-time-left">
                    {minutes < 10 ? '0'.concat(minutes) : minutes}:
                    {seconds < 10 ? '0'.concat(seconds) : seconds}
                </p>
            </section>
        )
    }
}

export default Timer