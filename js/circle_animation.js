document.addEventListener("DOMContentLoaded", function () {
    const target = document.querySelector('.blue_rectangle');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.75
    };
    function observerCallback(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('blue_circle');
                }, 500);
            }
        });
    }
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(target);
});