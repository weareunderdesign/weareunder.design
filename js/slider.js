function addSlider() {
    const TEMPLATE = `
    <div class="box-l view row product" id="body-content">
        <div class="slider view">
            <div class="slides view">

                <a href="https://weareunder.design/work/bounce/" target="_blank" class="slide view" id="bounce"
                    style="background-image: url('https://weareunder.design/work/bounce/0.png');"></a>
                <a href="https://weareunder.design/work/rnbw/" target="_blank" class="slide view" id="rnbw"
                    style="background-image: url('https://weareunder.design/work/rnbw/0.png');"></a>
                <a href="https://weareunder.design/work/nilus/" target="_blank" class="slide view" id="nilus"
                    style="background-image: url('https://weareunder.design/work/nilus/0.png');"></a>
                <a href="https://weareunder.design/work/spacetop/" target="_blank" class="slide view" id="spacetop"
                    style="background-image: url('https://weareunder.design/work/spacetop/0.png');"></a>
                <a href="https://weareunder.design/work/blockaid/" target="_blank" class="slide view" id="blockaid"
                    style="background-image: url('https://weareunder.design/work/blockaid/0.png');"></a>
                <a href="https://weareunder.design/work/soli/" target="_blank" class="slide" id="soli"
                    style="background-image: url('https://weareunder.design/work/soli/19.png');"></a>
                <a href="https://weareunder.design/work/justripe/" target="_blank" class="slide view" id="justripe"
                    style="background-image: url('https://weareunder.design/work/justripe/09.png');"></a>
                <a href="https://weareunder.design/work/utila/" target="_blank" class="slide view" id="utila"
                    style="background-image: url('https://weareunder.design/work/utila/0.png');"></a>
                <a href="https://weareunder.design/work/balance/" target="_blank" class="slide view" id="balance"
                    style="background-image: url('https://weareunder.design/work/balance/0.png');"></a>
                <a href="https://weareunder.design/work/visioncamp/" target="_blank" class="slide view" id="visioncamp"
                    style="background-image: url('https://weareunder.design/work/visioncamp/6.png');"></a>
                <a href="https://weareunder.design/work/dymension/" target="_blank" class="slide view" id="dymension"
                    style="background-image: url('https://weareunder.design/work/dymension/0.png');"></a>
                <a href="https://weareunder.design/work/finaloop/" target="_blank" class="slide view" id="finaloop"
                    style="background-image: url('https://weareunder.design/work/finaloop/0.png');"></a>
                <a href="https://weareunder.design/work/groundcover/" target="_blank" class="slide view" id="groundcover"
                    style="background-image: url('https://weareunder.design/work/groundcover/0.png');"></a>
                <a href="https://weareunder.design/work/raftt/" target="_blank" class="slide view" id="raftt"
                    style="background-image: url('https://weareunder.design/work/raftt/0.png');"></a>
                <a href="https://weareunder.design/work/togetherr/" target="_blank" class="slide view" id="togetherr"
                    style="background-image: url('https://weareunder.design/work/togetherr/0.png');"></a>
                <a href="https://weareunder.design/work/upword/" target="_blank" class="slide view" id="upword"
                    style="background-image: url('https://weareunder.design/work/upword/0.png');"></a>
                <a href="https://weareunder.design/work/alcide/" target="_blank" class="slide view" id="alcide"
                    style="background-image: url('https://weareunder.design/work/alcide/0.png');"></a>
                <a href="https://weareunder.design/work/darna/" target="_blank" class="slide view" id="darna"
                    style="background-image: url('https://weareunder.design/work/darna/0.png');"></a>
                <a href="https://weareunder.design/work/everafter/" target="_blank" class="slide view" id="everafter"
                    style="background-image: url('https://weareunder.design/work/everafter/0.png');"></a>
                <a href="https://weareunder.design/work/faintlines/" target="_blank" class="slide view" id="faintlines"
                    style="background-image: url('https://weareunder.design/work/faintlines/0.png');"></a>
                <a href="https://weareunder.design/work/flume/" target="_blank" class="slide view" id="flume"
                    style="background-image: url('https://weareunder.design/work/flume/0.png');"></a>
                <a href="https://weareunder.design/work/grain/" target="_blank" class="slide view" id="grain"
                    style="background-image: url('https://weareunder.design/work/grain/0.png');"></a>
                <a href="https://weareunder.design/work/healthquarters/" target="_blank" class="slide view" id="healthquarters"
                    style="background-image: url('https://weareunder.design/work/healthquarters/0.png');"></a>
                <a href="https://weareunder.design/work/iceberg/" target="_blank" class="slide view" id="iceberg"
                    style="background-image: url('https://weareunder.design/work/iceberg/0.png');"></a>
                <a href="https://weareunder.design/work/karma/" target="_blank" class="slide view" id="karma"
                    style="background-image: url('https://weareunder.design/work/karma/0.png');"></a>
                <a href="https://weareunder.design/work/larosh/" target="_blank" class="slide view" id="larosh"
                    style="background-image: url('https://weareunder.design/work/larosh/0.png');"></a>
                <a href="https://weareunder.design/work/le_salon/" target="_blank" class="slide view" id="le_salon"
                    style="background-image: url('https://weareunder.design/work/le_salon/0.png');"></a>
                <a href="https://weareunder.design/work/mesh_payments/" target="_blank" class="slide view" id="mesh_payments"
                    style="background-image: url('https://weareunder.design/work/mesh_payments/0.png');"></a>
                <a href="https://weareunder.design/work/notch/" target="_blank" class="slide view" id="notch"
                    style="background-image: url('https://weareunder.design/work/notch/0.png');"></a>
                <a href="https://weareunder.design/work/perdiem/" target="_blank" class="slide view" id="perdiem"
                    style="background-image: url('https://weareunder.design/work/perdiem/0.png');"></a>
                <a href="https://weareunder.design/work/reeco/" target="_blank" class="slide view" id="reeco"
                    style="background-image: url('https://weareunder.design/work/reeco/0.png');"></a>
                <a href="https://weareunder.design/work/reflect/" target="_blank" class="slide view" id="reflect"
                    style="background-image: url('https://weareunder.design/work/reflect/0.png');"></a>
                <a href="https://weareunder.design/work/tagbox/" target="_blank" class="slide view" id="tagbox"
                    style="background-image: url('https://weareunder.design/work/tagbox/0.png');"></a>
                <a href="https://weareunder.design/work/revelations/" target="_blank" class="slide view" id="revelations"
                    style="background-image: url('https://weareunder.design/work/revelations/0.png');"></a>
                <a href="https://weareunder.design/work/unit/" target="_blank" class="slide view" id="unit"
                    style="background-image: url('https://weareunder.design/work/unit/0.png');"></a>
                <a href="https://weareunder.design/work/unleash/" target="_blank" class="slide view" id="unleash"
                    style="background-image: url('https://weareunder.design/work/unleash/0.png');"></a>
                <a href="https://weareunder.design/work/zigi/" target="_blank" class="slide view" id="zigi"
                    style="background-image: url('https://weareunder.design/work/zigi/0.png');"></a>
                <a href="https://weareunder.design/work/zoog/" target="_blank" class="slide view" id="zoog"
                    style="background-image: url('https://weareunder.design/work/zoog/0.png');"></a>



            </div>
            <button class="arrow prev padding-xl"><img src="./images/arrow_left.svg" /></button>
            <p class="slidertext white padding-xl">finaloop</p>
            <button class="arrow next padding-xl"><img src="./images/arrow_right.svg" /></button>
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
    
    const slides = document.querySelector('.slides');
    const slide = document.querySelectorAll('.slide');
    const slideText = document.querySelector('.slidertext');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;
    
    let direction = 1; 
    const interval = 3000; 
    
    function updateSlider() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        const currentSlideId = slide[currentIndex].id;
        slideText.textContent = currentSlideId;
    
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
    }
    
    function autoSlide() {
        if (direction === 1 && currentIndex === slide.length - 1) {
            direction = -1; 
        } else if (direction === -1 && currentIndex === 0) {
            direction = 1; 
        }
    
        currentIndex += direction;
        updateSlider();
    }
    
    setInterval(autoSlide, interval);
    
    updateSlider();
    }
    
    addSlider();