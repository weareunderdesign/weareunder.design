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
        return projects.map(project => `
            <a href="${project.href}" class="slide view" id="${project.id}"
                style="background-image: url('${project.imageUrl}');"></a>
        `).join('');
    }

    const projects = getProjectsFromNavigation();
    
    const TEMPLATE = `
    <div class="box-l view row product" id="body-content">
        <div class="slider view">
            <div class="slides view">
                ${generateSlidesHTML(projects)}
            </div>
            <p class="padding-xl white slidertext" style="mix-blend-mode: difference;">finaloop</p>
            <div class="sliderbuttons padding-xl">
                <button class="arrow prev" style="mix-blend-mode: difference;">
                    <img src="https://weareunder.design/images/arrow_left.svg" />
                </button>
                <button class="arrow next" style="mix-blend-mode: difference;">
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
    let currentPosition = 0;
    
    let isAutoScrolling = true;
    let scrollDirection = 0.02;
    let animationFrameId;
    
    slides.style.transition = 'none'; 
    slides.style.willChange = 'transform'; 
    
    function updateSlider() {
        const totalWidth = slide.length * 100;
        currentPosition = (currentPosition + totalWidth) % totalWidth;
        slides.style.transform = `translateX(${-currentPosition}%)`;
        
        const currentSlideIndex = Math.floor(currentPosition / 100);
        const currentSlideId = slide[currentSlideIndex % slide.length].id;
        slideText.textContent = currentSlideId;
    }
    
    function moveToSlide(index) {
        // Убираем transition перед изменением позиции
        slides.style.transition = 'none';
        
        currentPosition = index * 100;
        if (currentPosition < 0) {
            currentPosition = (slide.length - 1) * 100;
        } else if (currentPosition >= slide.length * 100) {
            currentPosition = 0;
        }
        
        // Сразу обновляем позицию без анимации
        updateSlider();
        
        // Добавляем transition только для следующего изменения
        requestAnimationFrame(() => {
            slides.style.transition = 'transform 0.5s ease';
        });
    }
    
    function autoScroll() {
        if (!isAutoScrolling) return;

        currentPosition += scrollDirection;
        
        // Если достигли края, мгновенно переходим к противоположному краю
        if (currentPosition <= 0) {
            currentPosition = (slide.length - 1) * 100;
            scrollDirection = Math.abs(scrollDirection); // меняем направление на положительное
        } else if (currentPosition >= (slide.length - 1) * 100) {
            currentPosition = 0;
            scrollDirection = -Math.abs(scrollDirection); // меняем направление на отрицательное
        }
        
        updateSlider();
        animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    function startAutoScroll() {
        isAutoScrolling = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    function stopAutoScroll() {
        isAutoScrolling = false;
        cancelAnimationFrame(animationFrameId);
    }
    
    function handleManualScroll() {
        stopAutoScroll();
    }
    
    updateSlider();
    startAutoScroll();
    
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
    
    prevButton.addEventListener('click', () => {
        let index = Math.floor(currentPosition / 100);
        index = (index - 1 + slide.length) % slide.length;
        moveToSlide(index);
        handleManualScroll();
    });
    
    nextButton.addEventListener('click', () => {
        let index = Math.floor(currentPosition / 100);
        index = (index + 1) % slide.length;
        moveToSlide(index);
        handleManualScroll();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addSlider, 100);
});
