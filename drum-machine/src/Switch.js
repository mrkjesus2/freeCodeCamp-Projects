import React from 'react'
import './Switch.css'

function Switch(props) {
    function handleClick(ev) {
        ev.target.checked
            ? props.setState('ON')
            : props.setState('OFF')
    }

    return (
        <>
            <label className="drum-machine-controls-switch" onClick={handleClick}>
                {props.name}
                <input name={props.name} type="checkbox" defaultChecked/>
            </label>
        </> 
    )
}

export default Switch