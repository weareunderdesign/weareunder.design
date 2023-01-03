const TEMPLATE = `
<footer>
<a class="footer-logo" href="/">
    <img src="/images/under-footer.svg">
</a>
<div class="footer-content">
    We are a creative team, designing digital brands & products through solid
    strategy and research. We admire simplicity, communication and focused process.
</div>
<div class="footer-links">
    <a href="https://www.behance.net/weareunder" target="_blank">
        Behance
    </a>
    <a href="https://www.linkedin.com/company/underdesign/" target="_blank">
        Linkedin
    </a>
    <a href="https://www.instagram.com/under.design/" target="_blank">
        Instagram
    </a>
    <a href="mailto:hello@weareunder.design">
        Email
    </a>
</div>
</footer>
`;

class UnderFooter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = TEMPLATE;
  }
}
customElements.define("under-footer", UnderFooter);
