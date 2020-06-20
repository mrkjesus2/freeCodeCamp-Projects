import React from 'react';
import TimerSetting from './TimerSetting'
import Timer from './Timer'
import TimerControl from './TimerControl'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerIsActive: null,
      currTimer: 'Session',
      timeLeft: 10,
      session: 10,
      break: 300,
      timer: null,
      beepPlaying: false
    }
    this.incrementSetting = this.incrementSetting.bind(this)
    this.decrementSetting = this.decrementSetting.bind(this)
    this.controlClick = this.controlClick.bind(this)
  }

  componentDidMount() {
    this.setState({beep: document.getElementById('beep')})
  }
  
  incrementSetting(setting, val) {
    if (val < 3600) {
      this.setState((state) => ({
        [setting]: state[setting] + 60,
        timeLeft: setting === 'session' ? state[setting] + 60 : state.timeLeft
      }))
    }
  }

  decrementSetting(setting, val) {
    if (val > 60) {
      // console.log("Decrementing")
      this.setState((state) => ({
        [setting]: state[setting] - 60,
        timeLeft: setting === 'session' ? state[setting] - 60 : state.timeLeft

      }))
    }
  }

  controlClick(ev) {
    ev.target.id === 'reset'
      ? this.reset()
      : this.state.timerIsActive === true
        ? this.stopTimer()
        : this.startTimer()
  }
  
  startTimer() {
    this.timer = setInterval(() => {
      this.setState((state) => {
        if (state.timeLeft === 0) {
          // console.log("Trying to play")
          state.beep.play()
            .then(() => {
              this.setState({beepPlaying: true})
            })
            .catch(err => {
              console.error("Unable to play beep")
            })
        }
        return !state.timerIsActive && state.currTimer
            // Start timer
            ? {
                timerIsActive: true,
                currTimer: state.currTimer,
                timeLeft: state.timeLeft - 1
              }
            // Switch timer
            : state.timeLeft === 0 && state.timerIsActive
              ? {
                  currTimer: state.currTimer === "Session" ? "Break" : "Session",
                  timeLeft: state.currTimer === "Session" ? state.break : state.session
                }
              // Countdown
              : {
                  timeLeft: state.timeLeft - 1
                }
      })
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.timer)
    this.setState({timerIsActive: false})
  }

  reset() {
    this.stopTimer()
    this.setState((state) => {
      console.log(state.beepPlaying)
      if (state.beepPlaying) {
        console.log("Pausing")
        state.beep.pause()
        state.beep.currentTime = 0
      } else {
        console.log("Not Pausing")
      }
      return {
        session: 1500,
        break: 300,
        timeLeft: 1500,
        currTimer: 'Session',
        timerIsActive: null,
        beepPlaying: false
      }
    })
  }

  render() { 
    return (
      <main className="clock">
        <h1 className="clock-title">Pomodoro Clock</h1>
        <section className="clock-settings">
          <TimerSetting name="break" 
                dec={this.decrementSetting} 
                inc={this.incrementSetting} 
                value={this.state.break}
          />
          <TimerSetting name="session" 
                inc={this.incrementSetting} 
                dec={this.decrementSetting} 
                value={this.state.session}
          />
        </section>
        <Timer type={this.state.currTimer}
                time={this.state.timeLeft}
        />
        <audio src="http://www.weigel.site/assets/A-Tone-His_Self-1266414414.mp3" 
                id="beep"
                preload="auto"
        ></audio>
        <footer className="clock-controls">
          <TimerControl name="start_stop" 
                    icon={this.state.timerIsActive ? "fas fa-pause" : "fas fa-play"} 
                    clickHandler={this.controlClick}
                    activeTimer={this.state.timerIsActive}
          />
          <TimerControl name="reset" 
                    icon="fas fa-history" 
                    clickHandler={this.controlClick}
          />
        </footer>
      </main>
    )
  }
}


export default App;
