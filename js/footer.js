function addFooter() {
  const TEMPLATE = `
  <div class="row padding-xl gap-xl">
    <a href="https://weareunder.design/">
      <img src="https://weareunder.design/images/under-footer.svg" style="width: 92px;">
    </a>
    <h5 class="box">
      under creates high-quality,<br>
      well-designed, creative brands <br>
      and products for creative people.
    </h5>
    <div class="column">
      <a href="https://weareunder.design/brandsprint/">
        <h5>brandsprint</h5>
      </a>
      <a href="https://weareunder.design/articles/">
        <h5>articles</h5>
      </a>
      <a href="https://store.weareunder.design/">
        <h5>store</h5>
      </a>
    </div>
    <div class="column">
      <a href="https://store.weareunder.design/pages/newsletter" target="_blank">
        <h5>newsletter</h5>
      </a>
      <a href="https://www.instagram.com/under.design/" target="_blank">
      <h5>instagram</h5>
    </a>
    <a href="https://x.com/underdesign_" target="_blank">
    <h5>twitter</h5>
  </a>
      <a href="mailto:hello@weareunder.design">
        <h5>contact</h5>
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
