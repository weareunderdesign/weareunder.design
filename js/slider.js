function addSlider() {
    const SPECIAL_CASES = {
        'soli': '19',
        'justripe': '09',
        'visioncamp': '6',
        'rnbw': '1'
    };

    function getImageUrl(id) {
        const isSpecial = ['mesh_payments', 'zigi'].includes(id);
        const ext = isSpecial ? 'svg' : 'png';
        const number = SPECIAL_CASES[id] || '0';
        return `https://weareunder.design/work/${id}/${number}.${ext}`;
    }

    function getProjectsFromNavigation() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return [];

        const links = Array.from(sidebar.querySelectorAll('a.sidebar-project-link'));
        return links.map(link => {
            const id = link.id.split('-')[0];
            const href = link.href;
            return {
                id,
                href,
                imageUrl: getImageUrl(id)
            };
        });
    }

    function generateSlidesHTML(projects) {
        const clonedProjects = [
            projects[projects.length - 1],
            ...projects,
            projects[0]
        ];

        return clonedProjects.map((project, index) => `
            <a href="${project.href}" class="slide view" id="${project.id}" data-index="${index}"
                style="min-width: 100%; height: 100%; background-size: cover; background-position: center; background-image: url('${project.imageUrl}');"></a>
        `).join('');
    }

    const projects = getProjectsFromNavigation();

    const TEMPLATE = `
    <div class="view row box-l" id="body-content" style="background: no-repeat center/cover; position: relative;">
        <div class="view slider" style="position: relative; width: 100%; height: 61.8vw; overflow: hidden;">
            <div class="view slides" style="width: 100%; height: 61.8vw; display: flex; transition: transform 0.5s ease-in-out;">
                ${generateSlidesHTML(projects)}
            </div>
            <p class="padding-xl slidertext" style="mix-blend-mode: difference; color: white; position: absolute; bottom: 0px; left: 0%; white-space: nowrap; margin: 0.5rem, 0, 0.5rem, 0 !important; line-height: 1.35 !important;">finaloop</p>
            <div class="padding-xl sliderbuttons" style="position: absolute; bottom: 0px; right: 0%;">
                <button class="prev" style="mix-blend-mode: difference; border: none; background: none; cursor: pointer; width: 1.75rem; height: 1.75rem;">
                    <img src="https://weareunder.design/images/arrow_left.svg" />
                </button>
                <button class="next" style="mix-blend-mode: difference; border: none; background: none; cursor: pointer; width: 1.75rem; height: 1.75rem;">
                    <img src="https://weareunder.design/images/arrow_right.svg" />
                </button>
            </div>
        </div>
    </div>
    `;

    class UnderSlider extends HTMLElement {
        constructor() {
            super();
            this.innerHTML = TEMPLATE;
        }
    }
    customElements.define("under-slider", UnderSlider);

    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slides');
    const slide = document.querySelectorAll('.slide');
    const slideText = document.querySelector('.slidertext');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    let currentPosition = 100;

    let isAutoScrolling = true;
    let isManualControl = false;
    const scrollSpeed = 0.01;  // Уменьшили скорость автоскролла
    let animationFrameId = null;
    let isTransitioning = false;

    slides.style.transition = 'none';
    slides.style.willChange = 'transform';

    function updateSlider(withTransition = true) {
        if (withTransition) {
            slides.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            slides.style.transition = 'none';
        }

        slides.style.transform = `translateX(${-currentPosition}%)`;

        const realIndex = Math.floor(currentPosition / 100) - 1;
        const totalRealSlides = slide.length - 2;
        let normalizedIndex = realIndex;

        if (realIndex < 0) normalizedIndex = totalRealSlides - 1;
        if (realIndex >= totalRealSlides) normalizedIndex = 0;

        const currentSlideId = slide[normalizedIndex + 1].id;
        slideText.textContent = currentSlideId;
    }

    function handleTransitionEnd() {
        const totalSlides = slide.length;
        const currentIndex = Math.floor(currentPosition / 100);

        if (currentIndex === totalSlides - 1) {
            currentPosition = 100;
            updateSlider(false);
        } else if (currentIndex === 0) {
            currentPosition = (totalSlides - 2) * 100;
            updateSlider(false);
        }

        isTransitioning = false;
    }

    slides.addEventListener('transitionend', handleTransitionEnd);

    function moveToSlide(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Сначала выравниваем текущую позицию до ближайшего целого слайда
        currentPosition = Math.round(currentPosition / 100) * 100;
        updateSlider(false);  // Обновляем без анимации

        // Форсируем перерисовку
        void slides.offsetHeight;

        // Теперь делаем переход
        if (direction === 'next') {
            currentPosition += 100;
        } else {
            currentPosition -= 100;
        }

        updateSlider(true);
    }

    function autoScroll() {
        if (!isAutoScrolling) return;

        slides.style.transition = 'none';
        currentPosition += scrollSpeed;

        const totalSlides = slide.length;
        if (currentPosition >= (totalSlides - 1) * 100) {
            currentPosition = 100;
        }

        updateSlider(false);
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    function startAutoScroll() {
        if (!isManualControl) {
            isAutoScrolling = true;
            if (!animationFrameId) {
                // Выравниваем позицию перед стартом автоскролла
                currentPosition = Math.round(currentPosition / 100) * 100;
                updateSlider(false);
                autoScroll();
            }
        }
    }

    function stopAutoScroll() {
        isAutoScrolling = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            
            // Добавили плавный переход при остановке
            slides.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            currentPosition = Math.round(currentPosition / 100) * 100;
            updateSlider(true);
        }
    }

    updateSlider(false);
    startAutoScroll();

    slider.addEventListener('mouseenter', () => {
        stopAutoScroll();
    });

    slider.addEventListener('mouseleave', () => {
        if (!isManualControl) {
            startAutoScroll();
        }
    });

    prevButton.addEventListener('click', () => {
        isManualControl = true;
        stopAutoScroll();
        moveToSlide('prev');
    });

    nextButton.addEventListener('click', () => {
        isManualControl = true;
        stopAutoScroll();
        moveToSlide('next');
    });

    slider.addEventListener('mouseleave', () => {
        setTimeout(() => {
            isManualControl = false;
            if (!slider.matches(':hover')) {
                startAutoScroll();
            }
        }, 500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addSlider, 100);
});