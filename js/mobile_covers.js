function updateMobileCovers() {
    const elements = document.querySelectorAll('[data-desktop-image][data-mobile-image]');

    elements.forEach(element => {
        const desktopImage = element.getAttribute('data-desktop-image');
        const mobileImage = element.getAttribute('data-mobile-image');

        if (window.innerWidth < 768) {
            element.style.backgroundImage = `url(${mobileImage})`;
        } else {
            element.style.backgroundImage = `url(${desktopImage})`;
        }
    });
}

window.addEventListener('load', updateMobileCovers);
window.addEventListener('resize', updateMobileCovers);