function addHeader() {
  const imagePath = `${location.origin}/images/under-header-logo.svg`;
  const workPath = `${location.origin}/#work-section`;
  const TEMPLATE = `
  <div class="flex" >
        <a class="logo padding-xl" href="/">
            <img src="${imagePath}" />
        </a>
        <div class="panel padding-xl gap-xs" style="color:white;position:fixed; right:0;z-index:999;">
            <a class="header-link" href=${workPath}><h4>Work</h4></a>
            <a class="header-link" href="https://store.weareunder.design"><h4>Store</h4></a>
            <a class="header-link" href="mailto:hello@weareunder.design"><h4>Contact</h4></a>
        </div>
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
