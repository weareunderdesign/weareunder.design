function addHeader() {
    const TEMPLATE = `
  <div class="flex" >
        <a class="logo padding-xl mix-diff" href="/">
            <img src="https://weareunder.design/images/under-header-logo.svg" />
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
