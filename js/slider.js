function addSlider() {
    function getProjectsFromNavigation() {
        const sidebar = document.getElementById('sidebar-work');
        if (!sidebar) return [];

        return Array.from(sidebar.querySelectorAll('a.sidebar-project-link')).map(link => {
            const id = link.id.split('-')[0];
            // Special cases for image paths
            let imageNumber = '0';
            if (id === 'chargeflow') imageNumber = '00';
            if (id === 'justripe') imageNumber = '09';
            if (id === 'soli') imageNumber = '19';
            if (id === 'visioncamp') imageNumber = '6';
            if (id === 'rnbw') imageNumber = '1';

            const ext = (id === 'mesh_payments' || id === 'zigi') ? 'svg' : 'png';
            
            return {
                id,
                href: link.href,
                name: link.textContent,
                imageUrl: `https://weareunder.design/work/${id}/${imageNumber}.${ext}`
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
    if (!projects.length) return;

    const TEMPLATE = `
    <div class="view row box-l" id="body-content" style="background: no-repeat center/cover; position: relative;">
        <div class="view slider" style="position: relative; width: 100%; height: 61.8vw; overflow: hidden;">
            <div class="view slides" style="width: 100%; height: 61.8vw; display: flex; transition: transform 0.5s ease-in-out;">
                ${generateSlidesHTML(projects)}
            </div>
            <p class="padding-xl slidertext" style="mix-blend-mode: difference; color: white; position: absolute; bottom: 0px; left: 0%; white-space: nowrap; margin: 0.5rem, 0, 0.5rem, 0 !important; line-height: 1.35 !important;">${projects[0].name}</p>
            <div class="padding-xl sliderbuttons" style="position: absolute; bottom: 0px; right: 0%;">
                <button class="prev" style="mix-blend-mode: difference; border: none; background: none; cursor: pointer;">
                    <img src="https://weareunder.design/images/arrow_left.svg" />
                </button>
                <button class="next" style="mix-blend-mode: difference; border: none; background: none; cursor: pointer;">
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
    const scrollSpeed = window.innerWidth <= 768 ? 0.08 : 0.035;
    let animationFrameId = null;
    let isTransitioning = false;

    slides.style.transition = 'none';
    slides.style.willChange = 'transform';

    function updateSlideText() {
        const realIndex = Math.floor(currentPosition / 100) - 1;
        const totalRealSlides = slide.length - 2;
        let normalizedIndex = realIndex;

        if (realIndex < 0) normalizedIndex = totalRealSlides - 1;
        if (realIndex >= totalRealSlides) normalizedIndex = 0;

        const currentSlide = slide[normalizedIndex + 1];
        const projectData = projects.find(p => p.id === currentSlide.id);
        slideText.textContent = projectData ? projectData.name : currentSlide.id;
    }

    function handleTransitionEnd() {
        const totalSlides = slide.length;
        const currentIndex = Math.floor(currentPosition / 100);

        if (currentIndex === totalSlides - 1) {
            slides.style.transition = 'none';
            currentPosition = 100;
            slides.style.transform = `translateX(-100%)`;
        } else if (currentIndex === 0) {
            slides.style.transition = 'none';
            currentPosition = (totalSlides - 2) * 100;
            slides.style.transform = `translateX(-${currentPosition}%)`;
        }

        isTransitioning = false;
        updateSlideText();
    }

    slides.addEventListener('transitionend', handleTransitionEnd);

    function moveToSlide(direction) {
        if (isTransitioning) return;
        stopAutoScroll();
        
        currentPosition = Math.round(currentPosition / 100) * 100;
        slides.style.transform = `translateX(-${currentPosition}%)`;

        requestAnimationFrame(() => {
            isTransitioning = true;
            slides.style.transition = 'transform 0.5s ease';
            currentPosition += direction === 'next' ? 100 : -100;
            slides.style.transform = `translateX(-${currentPosition}%)`;
            updateSlideText();
        });
    }

    function autoScroll() {
        if (!isAutoScrolling) return;
        slides.style.transition = 'none';
        currentPosition += scrollSpeed;

        if (currentPosition >= (slide.length - 1) * 100) {
            currentPosition = 100;
        }

        slides.style.transform = `translateX(-${currentPosition}%)`;
        updateSlideText();
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    function startAutoScroll() {
        if (!isManualControl && !animationFrameId) {
            isAutoScrolling = true;
            autoScroll();
        }
    }

    function stopAutoScroll() {
        isAutoScrolling = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Initialize slider position and start auto-scroll
    slides.style.transform = `translateX(-${currentPosition}%)`;
    updateSlideText();
    startAutoScroll();

    // Event listeners
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', () => !isManualControl && startAutoScroll());
    
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

// Initialize when navigation is ready
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementById('sidebar-work')) {
            obs.disconnect();
            addSlider();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // Fallback
    setTimeout(() => {
        observer.disconnect();
        if (!document.getElementById('sidebar-work')) {
            addSlider();
        }
    }, 3000);
});