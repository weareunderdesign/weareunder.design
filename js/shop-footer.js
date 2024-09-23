const footerTemplate = `
<footer class="padding-xl box-l">
  <div class="gap-s row align-start box-l">
    <div class="gap-l column align-start box" style="display: none;">
      <a href="https://rnbw.design">
        <svg-icon src="https://rnbw.design/images/rnbw.svg"></svg-icon>
      </a>
      <div class="text-s">
        © <span id="year"></span> Rainbow Design, Ltd.
      </div>
    </div>
    <div class="gap-xl row align-start box-l">
      <a style="width: 5.25vw; height 5.25vw;" href="https://weareunder.design/">
        <img style="width: 5.25vw; height 5.25vw;" src="https://weareunder.design/images/under-footer.svg">
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
        <a href="https://weareunder.design/blog/">
          <h5>blog</h5>
        </a>
        <a href="https://store.weareunder.design/">
          <h5>store</h5>
        </a>
        <a href="mailto:hello@weareunder.design">
          <h5>contact</h5>
        </a>
        <a href="https://weareunder.design/legal">
          <h5>legal</h5>
        </a>
      </div>
      <div class="column align-start">
        <a href="https://store.weareunder.design/pages/newsletter" target="_blank">
          <h5>newsletter</h5>
        </a>
        <a href="https://www.instagram.com/under.design/" target="_blank">
          <h5>instagram</h5>
        </a>
        <a href="https://x.com/underdesign_" target="_blank">
          <h5>twitter</h5>
        </a>
        <a href="https://github.com/weareunderdesign" target="_blank">
          <h5>github</h5>
        </a>
      </div>
    </div>
  </div>
</footer>
`;

class underFooter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = footerTemplate;
  }

  connectedCallback() {
    const currentYear = new Date().getFullYear();
    const yearElement = this.querySelector("#year");
    if (yearElement) {
      yearElement.textContent = currentYear;
    }
  }
}

customElements.define("under-footer", underFooter);