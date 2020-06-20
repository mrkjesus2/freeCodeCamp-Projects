document.getElementById('form').onsubmit = (ev) => {
    ev.preventDefault()

    let thanksEl = document.getElementById('thanks')

    document.getElementById('form').className = "hidden"
    thanksEl.removeAttribute('class')
    setTimeout(() => {
        thanksEl.className = 'hidden'
    }, 1500)
}
