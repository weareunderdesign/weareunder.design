function addHeader() {
    const TEMPLATE = `
        <a class="logo padding-xl mix-diff" href="/" style="position: fixed; z-index: 99;">
            <img src="https://weareunder.design/images/under-header-logo.svg" />
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
