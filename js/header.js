function addHeader() {
    const TEMPLATE = `
        <a class="logo padding-xl" href="/">
            <img src="././images/under-header-logo.svg" />
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
