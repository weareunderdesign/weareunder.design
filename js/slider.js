function addSlider() {
    const TEMPLATE = `
    <div class="box-l view row product" id="body-content">
        <div class="slider view">
            <div class="slides view">
            <a href="https://weareunder.design/work/pointfive/" class="slide view" id="pointfive"
                    style="background-image: url('https://weareunder.design/work/pointfive/0.png');"></a>
                <a href="https://weareunder.design/work/bounce/" class="slide view" id="bounce"
                    style="background-image: url('https://weareunder.design/work/bounce/0.png');"></a>
                <a href="https://weareunder.design/work/nilus/" class="slide view" id="nilus"
                    style="background-image: url('https://weareunder.design/work/nilus/0.png');"></a>
                <a href="https://weareunder.design/work/spacetop/" class="slide view" id="spacetop"
                    style="background-image: url('https://weareunder.design/work/spacetop/0.png');"></a>
                <a href="https://weareunder.design/work/blockaid/" class="slide view" id="blockaid"
                    style="background-image: url('https://weareunder.design/work/blockaid/0.png');"></a>
                <a href="https://weareunder.design/work/soli/" class="slide" id="soli"
                    style="background-image: url('https://weareunder.design/work/soli/19.png');"></a>
                <a href="https://weareunder.design/work/justripe/" class="slide view" id="justripe"
                    style="background-image: url('https://weareunder.design/work/justripe/09.png');"></a>
                <a href="https://weareunder.design/work/utila/" class="slide view" id="utila"
                    style="background-image: url('https://weareunder.design/work/utila/0.png');"></a>
                <a href="https://weareunder.design/work/balance/" class="slide view" id="balance"
                    style="background-image: url('https://weareunder.design/work/balance/0.png');"></a>
                <a href="https://weareunder.design/work/visioncamp/" class="slide view" id="visioncamp"
                    style="background-image: url('https://weareunder.design/work/visioncamp/6.png');"></a>
                <a href="https://weareunder.design/work/dymension/" class="slide view" id="dymension"
                    style="background-image: url('https://weareunder.design/work/dymension/0.png');"></a>
                <a href="https://weareunder.design/work/finaloop/" class="slide view" id="finaloop"
                    style="background-image: url('https://weareunder.design/work/finaloop/0.png');"></a>
                <a href="https://weareunder.design/work/groundcover/" class="slide view" id="groundcover"
                    style="background-image: url('https://weareunder.design/work/groundcover/0.png');"></a>
                <a href="https://weareunder.design/work/raftt/" class="slide view" id="raftt"
                    style="background-image: url('https://weareunder.design/work/raftt/0.png');"></a>
                <a href="https://weareunder.design/work/togetherr/" class="slide view" id="togetherr"
                    style="background-image: url('https://weareunder.design/work/togetherr/0.png');"></a>
                <a href="https://weareunder.design/work/upword/" class="slide view" id="upword"
                    style="background-image: url('https://weareunder.design/work/upword/0.png');"></a>
                <a href="https://weareunder.design/work/alcide/" class="slide view" id="alcide"
                    style="background-image: url('https://weareunder.design/work/alcide/0.png');"></a>
                <a href="https://weareunder.design/work/darna/" class="slide view" id="darna"
                    style="background-image: url('https://weareunder.design/work/darna/0.png');"></a>
                <a href="https://weareunder.design/work/everafter/" class="slide view" id="everafter"
                    style="background-image: url('https://weareunder.design/work/everafter/0.png');"></a>
                <a href="https://weareunder.design/work/faintlines/" class="slide view" id="faintlines"
                    style="background-image: url('https://weareunder.design/work/faintlines/0.png');"></a>
                <a href="https://weareunder.design/work/flume/" class="slide view" id="flume"
                    style="background-image: url('https://weareunder.design/work/flume/0.png');"></a>
                <a href="https://weareunder.design/work/grain/" class="slide view" id="grain"
                    style="background-image: url('https://weareunder.design/work/grain/0.png');"></a>
                <a href="https://weareunder.design/work/healthquarters/" class="slide view" id="healthquarters"
                    style="background-image: url('https://weareunder.design/work/healthquarters/0.png');"></a>
                <a href="https://weareunder.design/work/iceberg/" class="slide view" id="iceberg"
                    style="background-image: url('https://weareunder.design/work/iceberg/0.png');"></a>
                <a href="https://weareunder.design/work/karma/" class="slide view" id="karma"
                    style="background-image: url('https://weareunder.design/work/karma/0.png');"></a>
                <a href="https://weareunder.design/work/larosh/" class="slide view" id="larosh"
                    style="background-image: url('https://weareunder.design/work/larosh/0.png');"></a>
                <a href="https://weareunder.design/work/le_salon/" class="slide view" id="le salon"
                    style="background-image: url('https://weareunder.design/work/le_salon/0.png');"></a>
                <a href="https://weareunder.design/work/mesh_payments/" class="slide view" id="mesh payments"
                    style="background-image: url('https://weareunder.design/work/mesh_payments/0.svg');"></a>
                <a href="https://weareunder.design/work/notch/" class="slide view" id="notch"
                    style="background-image: url('https://weareunder.design/work/notch/0.png');"></a>
                <a href="https://weareunder.design/work/perdiem/" class="slide view" id="perdiem"
                    style="background-image: url('https://weareunder.design/work/perdiem/0.png');"></a>
                <a href="https://weareunder.design/work/reeco/" class="slide view" id="reeco"
                    style="background-image: url('https://weareunder.design/work/reeco/0.png');"></a>
                <a href="https://weareunder.design/work/reflect/" class="slide view" id="reflect"
                    style="background-image: url('https://weareunder.design/work/reflect/0.png');"></a>
                <a href="https://weareunder.design/work/tagbox/" class="slide view" id="tagbox"
                    style="background-image: url('https://weareunder.design/work/tagbox/0.png');"></a>
                <a href="https://weareunder.design/work/revelations/" class="slide view" id="revelations"
                    style="background-image: url('https://weareunder.design/work/revelations/0.png');"></a>
                <a href="https://weareunder.design/work/unit/" class="slide view" id="unit"
                    style="background-image: url('https://weareunder.design/work/unit/0.png');"></a>
                <a href="https://weareunder.design/work/unleash/" class="slide view" id="unleash"
                    style="background-image: url('https://weareunder.design/work/unleash/0.png');"></a>
                <a href="https://weareunder.design/work/zigi/" class="slide view" id="zigi"
                    style="background-image: url('https://weareunder.design/work/zigi/0.svg');"></a>
                <a href="https://weareunder.design/work/zoog/" class="slide view" id="zoog"
                    style="background-image: url('https://weareunder.design/work/zoog/0.png');"></a>
                <a href="https://weareunder.design/work/rnbw/" class="slide view" id="rnbw"
                    style="background-image: url('https://weareunder.design/work/rnbw/1.png');"></a>
            </div>
            <p class="padding-xl white slidertext" style="mix-blend-mode: difference;">finaloop</p>
            <div class="sliderbuttons padding-xl">
                <button class="arrow prev" style="mix-blend-mode: difference;"><img src="https://weareunder.design/images/arrow_left.svg" /></button>
                <button class="arrow next" style="mix-blend-mode: difference;"><img src="https://weareunder.design/images/arrow_right.svg" /></button>
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
    let scrollDirection = 0.045;
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
        currentPosition = index * 100;
        if (currentPosition < 0) {
            currentPosition = (slide.length - 1) * 100;
        } else if (currentPosition >= slide.length * 100) {
            currentPosition = 0;
        }
        slides.style.transition = 'transform 0.5s ease'; 
        updateSlider();
        setTimeout(() => {
            slides.style.transition = 'none'; 
        }, 500);
    }
    
    function autoScroll() {
        if (!isAutoScrolling) return;
    
        currentPosition += scrollDirection;
        if (currentPosition <= 0 || currentPosition >= (slide.length - 1) * 100) {
            scrollDirection *= -1; 
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

addSlider();