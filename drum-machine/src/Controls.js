import React, {useState, useRef, useEffect} from 'react'
import Switch from './Switch'
import Slider from './Slider'
import Display from './Display'
import "./Controls.css"

function Controls(props) {
    const [power, setPower] = useState('ON')
    const [volume, setVolume] = useState(50)

    const prevVolume = usePrevious(volume)
    const prevPower = usePrevious(power)
    const prevSounds = usePrevious(props.soundBank)

    function usePrevious(val) {
      const ref = useRef()
      useEffect(() => {
        ref.current = val
      })
      return ref.current
    }

    useEffect(() => {
      if (power === prevPower && props.soundBank !== prevSounds && power === 'ON') {
        props.soundBank === 'ON' ? props.setText(2) : props.setText(1)
        setTimeout(() => {
          props.setText(power)
        }, 1000)
      } else if (power === prevPower && volume !== prevVolume && power === 'ON') {
        props.setText(volume)
        setTimeout(() => {
          props.setText(power)
        }, 5000)
      } else {
        props.setText(power)
      }
    }, [power, volume, props.soundBank])

    return(
        <section className="drum-machine-controls">
          <Switch       
            name='Power'
            power={power}
            setState={setPower}
          />
          <Display
            text={props.text}
          />
          <Slider
            name="Volume"
            volume={volume}
            set={setVolume}
            min='0'
            max='100'
          />
          <Switch
            name='Sound Bank'
            sounds={props.soundBank}
            setState={props.setSoundBank}
          />
        </section>
    )
}

export default Controls