function addHeader() {
  const imagePath = `${location.origin}/images/under-header-logo.svg`;
  const TEMPLATE = `
        <a class="logo padding-xl" href="/">
            <img src="${imagePath}" />
        </a>
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
