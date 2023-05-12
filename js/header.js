function addHeader() {
  const TEMPLATE = `
  <div class="flex" >
        <a class="logo padding-xl" href="/">
            <img src="https://weareunder.design/images/under-header-logo.svg" />
        </a>
        <nav class="direction-row padding-xl gap-xs" style="color:white;position:absolute; right:0;z-index:999;  mix-blend-mode: difference;">
            <a class="header-link" href="#"><h4>Work</h4></a>
            <a class="header-link" href="#brand-sprints-section"><h4>Brand Sprints</h4></a>
            <a class="header-link" href="https://store.weareunder.design"><h4>Store</h4></a>
            <a class="header-link" href="mailto:hello@weareunder.design"><h4>Contact</h4></a>
        </nav>
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
