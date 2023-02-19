function addFooter() {
  const TEMPLATE = `
  <div class="direction-column padding-xl gap-xl">
    <a href="/">
      <img src="/images/under.svg" style="width: 160px;">
    </a>
    <h4 class="box">
      We are a creative team, designing digital brands & products through solid
      strategy and research. We admire simplicity, communication and focused process.
    </h4>
    <div class="direction-row">
      <a href="https://www.behance.net/weareunder" target="_blank">
        <h4>Behance</h4>
      </a>
      <a href="https://www.linkedin.com/company/underdesign/" target="_blank">
        <h4>Linkedin</h4>
      </a>
      <a href="https://www.instagram.com/under.design/" target="_blank">
        <h4>Instagram</h4>
      </a>
      <a href="mailto:hello@weareunder.design">
        <h4>Email</h4>
      </a>
    </div>
    <div class="direction-row">
      <a href="https://www.behance.net/weareunder" target="_blank">
        <h4>Behance</h4>
      </a>
      <a href="https://www.linkedin.com/company/underdesign/" target="_blank">
        <h4>Linkedin</h4>
      </a>
      <a href="https://www.instagram.com/under.design/" target="_blank">
        <h4>Instagram</h4>
      </a>
      <a href="mailto:hello@weareunder.design">
        <h4>Email</h4>
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
