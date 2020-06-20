import React, {useRef, useEffect} from "react"
import DrumButton from './DrumButton'
import './DrumPads.css'

function DrumPads(props) {

    return (
        <section
              className="drum-machine-drumpads" 
        >
          <DrumButton 
            keyPress='Q'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/cymbal_crash.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='W'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/gamelan_hit_single.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='E'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/human_beatbox_drum.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='A'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/human_beatbox_hi_hat.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='S'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/large_gamelan_hit.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='D'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/small_gamelan_hit.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='Z'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/triangle.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='X'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/toy_drum.mp3`}
            setText={props.setText}
          />
          <DrumButton 
            keyPress='C'
            clip={`http://weigel.site/assets/sounds/code-camp-drums/${props.soundBank}/waterphone.mp3`}
            setText={props.setText}
          />
        </section>
    )
}

export default DrumPads