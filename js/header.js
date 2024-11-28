function addHeader() {
  const TEMPLATE = `
    <div class="box-l">
      <a href="https://weareunder.design/" class="box-xs" href="/" style="display: flex; position: fixed; z-index: 100000; justify-content: space-between; mix-blend-mode: difference; color: white;">
        <img src="https://rnbw.design/images/under/under.svg" class="desktop padding-xl"/>
        <img src="https://weareunder.design/images/under-header-logo-small.svg" class="mobile padding-l"/>
      </a>
    </div>
  `;

  class UnderHeader extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = TEMPLATE;
    }
  }
  customElements.define("under-header", UnderHeader);
}

addHeader();

const mediaQuery = window.matchMedia("(max-width: 992px)");
mediaQuery.addEventListener("change", handleMediaQueryChange);
handleMediaQueryChange(mediaQuery);

function handleMediaQueryChange(mediaQuery) {
  const mobileImg = document.querySelector("under-header img.mobile");
  const desktopImg = document.querySelector("under-header img.desktop");
  const nudgeFonts = document.querySelectorAll('.nudge_font');

  if (mediaQuery.matches) {
    mobileImg.style.display = "block";
    desktopImg.style.display = "none";
    nudgeFonts.forEach(element => {
      element.style.fontSize = "25vw";
    });
  } else {
    mobileImg.style.display = "none";
    desktopImg.style.display = "block";
    nudgeFonts.forEach(element => {
      element.style.fontSize = ""; 
    });
  }
}