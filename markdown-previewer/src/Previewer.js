import React from 'react'
import Toolbar from './Toolbar'
import './Previewer.css'

function Previewer(props) {
    const marked = window.marked 
    marked.setOptions({breaks: true})

    let parsed = marked(props.markdown)
    let sanitized = window.DOMPurify.sanitize(parsed)
    let isFullScreen = props.isFullScreen === 'Previewer' 
                        ? 'fullscreen' : ''
    let isHidden = props.isFullScreen && !isFullScreen  
                    ? ' hidden' : ''
    return (
        <section className={isFullScreen + isHidden + " preview"}>
            <Toolbar name='Previewer' 
                isFullScreen={props.isFullScreen}
                setFullScreen={props.setFullScreen}
            />
            <section id="preview" className="preview-text"
                dangerouslySetInnerHTML={{__html: sanitized}}    
            >
            </section>
        </section>
    )
}

export default Previewer