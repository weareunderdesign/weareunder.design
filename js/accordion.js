document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('#accordion');
    const greenAccordion = document.querySelector('.green_background#accordion');
    const yellowAccordion = document.querySelector('.yellow_background#accordion');
    const purpleAccordion = document.querySelector('.purple_background#accordion');
    const pinkAccordion = document.querySelector('.pink_background#accordion');
    const blueAccordion = document.querySelector('.blue_background#accordion');
    const orangeAccordion = document.querySelector('.orange_background#accordion');
    const blackAccordion = document.querySelector('.black_background#accordion');

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