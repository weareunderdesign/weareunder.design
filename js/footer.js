function addFooter() {
  const TEMPLATE = `
  <div class="row padding-xl gap-xl black_background">
    <a href="/">
      <img src="./images/under-footer.svg" style="width: 92px;">
    </a>
    <h4 class="box white">
      under creates high-quality,<br>
      well-designed, creative brands <br>
      and products for creative people.
    </h4>
    <div class="column white">
      <a href="https://store.weareunder.design/">
        <h4>store</h4>
      </a>
      <a href="https://www.figma.com/file/UTvs6k6N1lAOLBerchdKFV/Under?node-id=351%3A772&t=lUyeBYt3fKsDLcU9-1" target="_blank">
        <h4>press</h4>
      </a>
      <a href="https://www.instagram.com/under.design/" target="_blank">
      <h4>instagram</h4>
    </a>
    </div>
    <div class="column white">
      <a href="https://store.weareunder.design/pages/newsletter" target="_blank">
        <h4>newsletter</h4>
      </a>
      <a href="mailto:hello@weareunder.design">
        <h4>contact</h4>
      </a>
    </div>
  </div>
  `;

  class UnderFooter extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = TEMPLATE;
    }
  }
  customElements.define("under-footer", UnderFooter);
}

addFooter();
