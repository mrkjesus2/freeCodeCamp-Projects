import React, {useState, useEffect} from 'react';
import DrumPads from './DrumPads'
import Controls from './Controls'
import './App.css';

function App() {
  const [text, setText] = useState('ON')
  const [soundBank, setSoundBank] = useState('ON')

  let soundText = soundBank === 'ON' ? 'bankA' : 'bankB'

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  const handleKeyDown = (ev) => {
    document.getElementById(ev.key.toUpperCase()).play()
  }


  return (
    <main id="drum-machine" className="drum-machine">
      <header>
        <h1>Make Beats</h1>
        <section id="display" className="drum-machine-container">
          <DrumPads soundBank={soundText}
                    setText={setText}
          />
          <Controls soundBank={soundBank} text={text}
                    setSoundBank={setSoundBank} setText={setText}
          />
        </section>
      </header>
    </main>
  );
}


export default App;
