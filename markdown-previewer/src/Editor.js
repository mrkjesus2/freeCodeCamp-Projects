import React from 'react'
import Toolbar from './Toolbar'
import './Editor.css'

function Editor(props) {
    let isFullScreen = props.isFullScreen === 'Editor' ? 'fullscreen' : ''
    let isHidden = props.isFullScreen && !isFullScreen ? ' hidden' : ''

    return (
        <section className={isFullScreen + isHidden +  " editor"}>
            <Toolbar name="Editor"
                    isFullScreen={props.isFullScreen}
                    setFullScreen={props.setFullScreen}
            />
            <textarea name="editor" 
                    id="editor" 
                    className="editor-text"
                    value={props.text} 
                    onChange={props.handleInput}
            >
            </textarea>
        </section>
    )
}

export default Editor