function addFooter() {
  const TEMPLATE = `
  <div class="row padding-xl gap-xl">
    <a href="/">
      <img src="https://weareunder.design/images/under-footer.svg" style="width: 92px;">
    </a>
    <h4 class="box">
      under creates high-quality,<br>
      well-designed, creative brands <br>
      and products for creative people.
    </h4>
    <div class="column">
    <a href="https://weareunder.design/articles/">
        <h4>Articles</h4>
      </a>
      <a href="https://store.weareunder.design/">
        <h4>Privacy</h4>
      </a>
      <a href="https://store.weareunder.design/">
        <h4>Terms & conditions</h4>
      </a>
    </div>
    <div class="column">
      <a href="https://store.weareunder.design/pages/newsletter" target="_blank">
        <h4>Newsletter</h4>
      </a>
      <a href="https://www.instagram.com/under.design/" target="_blank">
      <h4>Instagram</h4>
    </a>
      <a href="mailto:hello@weareunder.design">
        <h4>Contact</h4>
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
