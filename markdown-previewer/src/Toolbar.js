import React from 'react'
import './Toolbar.css'

function Toolbar(props) {
    function handleClick(ev) {
        if (props.isFullScreen === props.name) {
            props.setFullScreen(null)
        } else {
            props.setFullScreen(props.name)
        }
    }

    return (
        <header className="toolbar">
            <h2 className="toolbar-title">{props.name}</h2>
            <i className="toolbar-icon fas fa-expand-arrows-alt"
                onClick={handleClick}
            >
            </i>
        </header>
    )
}

export default Toolbar