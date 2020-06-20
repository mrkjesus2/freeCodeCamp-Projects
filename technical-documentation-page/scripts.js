let intersection = new IntersectionObserver((entries) => {
    let classList = document.getElementById('nav-links').classList
    let contentTop = document.querySelector('.main-section:first-of-type')

    if (entries[0].isIntersecting) {
        if (classList.contains('fixed-nav-links')) {
            classList.remove('fixed-nav-links')
            contentTop.classList.remove('extra-padding')
        }
    } else {
        classList.add('fixed-nav-links')
        contentTop.classList.add('extra-padding')
    }    
})

intersection.observe(document.querySelector('.site-title'))