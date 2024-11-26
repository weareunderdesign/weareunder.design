document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('#accordion');
    const greenAccordion = document.querySelector('.green_background#accordion');
    const yellowAccordion = document.querySelector('.yellow_background#accordion');
    const purpleAccordion = document.querySelector('.purple_background#accordion');
    const pinkAccordion = document.querySelector('.pink_background#accordion');
    const blueAccordion = document.querySelector('.blue_background#accordion');
    const orangeAccordion = document.querySelector('.orange_background#accordion');
    const blackAccordion = document.querySelector('.black_background#accordion');

    accordions.forEach(accordion => {
        accordion.style.transition = 'flex-grow 0.3s ease';
        
        if (window.innerWidth <= 768) {
            accordion.classList.add('waitwhat');
        }
    });

    function setHeaderStyles() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        if (window.innerWidth <= 768) {
            accordionHeaders.forEach(header => {
                header.style.transform = 'rotate(0deg)';
                header.style.writingMode = 'horizontal-tb';
            });

            document.querySelector('.black-accordion')?.style.setProperty('display', 'none');
            
            document.querySelectorAll('.waitwhat1').forEach(el => {
                el.style.flexWrap = 'wrap !important';
            });
            
        } else {
            accordionHeaders.forEach(header => {
                header.style.transform = 'rotate(180deg)';
                header.style.writingMode = 'vertical-lr';
            });
            
            document.querySelector('.black-accordion')?.style.removeProperty('display');
        }
    }

    setHeaderStyles();

    window.addEventListener('resize', setHeaderStyles);

    function handleAccordionClick(clickedAccordion) {
        accordions.forEach(accordion => {
            if (accordion === clickedAccordion) {
                const visibleH4 = accordion.querySelector('p');
                const imageDiv = accordion.querySelector('.imageaccordion');
                accordion.style.flexGrow = '1';
                visibleH4.style.display = 'flex';
                imageDiv.style.display = 'flex';
            } else {
                const hiddenH4 = accordion.querySelector('p');
                const imageDiv = accordion.querySelector('.imageaccordion');
                hiddenH4.style.display = 'none';
                accordion.style.flexGrow = '0';
                imageDiv.style.display = 'none';
            }
        });
    }

    greenAccordion.addEventListener('click', function () {
        handleAccordionClick(greenAccordion);
    });

    yellowAccordion.addEventListener('click', function () {
        handleAccordionClick(yellowAccordion);
    });

    orangeAccordion.addEventListener('click', function () {
        handleAccordionClick(orangeAccordion);
    });

    purpleAccordion.addEventListener('click', function () {
        handleAccordionClick(purpleAccordion);
    });

    pinkAccordion.addEventListener('click', function () {
        handleAccordionClick(pinkAccordion);
    });

    blueAccordion.addEventListener('click', function () {
        handleAccordionClick(blueAccordion);
    });

    blackAccordion.addEventListener('click', function () {
        handleAccordionClick(blackAccordion);
    });
});