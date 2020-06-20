import React from 'react'
import './Slider.css'

function Slider(props) {

    return (
        <label htmlFor={props.name} className="drum-machine-controls-slider">
            {props.name}
            <input name={props.name} 
                value={props.volume}
                onChange={(ev) => props.set(ev.target.value)}
                type="range" 
                min={props.min} 
                max={props.max} 
            />
        </label>
    )
}

export default Slider