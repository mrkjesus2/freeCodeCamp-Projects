import React, { useRef, useEffect } from 'react'
import './DrumButton.css'

function DrumButton(props) {
    let ref = useRef()

    const playAudio = (el) => {
        el.play()
    }
    
    const handleClick = (ev) => {
        props.setText(props.keyPress)
        ev.target.children[0].play()
    }

    return (
        <button id={props.keyPress + '-pad'}
            className="drum-machine-drumpads-pad drum-pad"
            onClick={handleClick}        
        >
            {props.keyPress}
            <audio src={props.clip}
                ref={ref} 
                id={props.keyPress} 
                className="clip"
                preload="auto"
            >
            </audio>
        </button>
    )
}

export default DrumButton