import React from 'react'
import './Display.css'

function Display(props) {

    return (
        <p className="drum-machine-controls-display">{props.text}</p>
    )
}

export default Display