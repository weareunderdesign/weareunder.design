// Immediate theme initialization
(function initializeTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
  } else {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }
})();

const footerTemplate = `
<footer class="padding-xl box-l">
  <div class="gap-s row align-start box-l">
    <div class="gap-xl row align-start box-l">
      <a class="footer-logo" href="https://weareunder.design/">
        <svg-icon src="https://weareunder.design/images/outlinefooter.svg"></svg-icon>
      </a>
      <h5 class="box">
        under creates high-quality,<br>
        well-designed, creative brands <br>
        and products for creative people.
      </h5>

      <div class="column gap-xs">
        <div class="row gap-xl">
          <div class="column gap-xs">
            <a href="https://github.com/weareunderdesign" target="_blank">
              <h5>github</h5>
            </a>
            <a href="mailto:hello@weareunder.design">
              <h5>contact</h5>
            </a>
            <a href="https://weareunder.design/legal">
              <h5>legal</h5>
            </a>

          </div>
        
          <div class="column align-start gap-xs">
            <a href="https://www.youtube.com/@weareunderdesign">
              <h5>youtube</h5>
            </a>
            <a href="https://www.instagram.com/under.design/" target="_blank">
              <h5>instagram</h5>
            </a>
            <a href="https://x.com/underdesign_" target="_blank">
              <h5>twitter</h5>
            </a>
            <a href="#" id="theme-toggle">
              <h5 id="theme-name" class="opacity-l">system</h5>
            </a>
          </div>
        </div>
         <h5 id="subscribeButton">newsletter</h5>
         <div class="hidden row" id="subscribeForm">
            <h5>
              <input type="email" id="emailInput" placeholder="Subscribe" style="outline:none; border:none; max-width:200px;">
            </h5>
            <div class="align-center hidden" id="submit-newsletter">
                →
            </div>
          </div>
        </div>
      </div>
    </div> 
  </div>
</footer>
`;

function updateThemeElementsVisibility() {
  const theme = document.documentElement.getAttribute("data-theme");
  const lightElements = document.querySelectorAll(".light");
  const darkElements = document.querySelectorAll(".dark");

  lightElements.forEach((element) => {
    element.style.display = theme === "dark" ? "none" : "";
  });

  darkElements.forEach((element) => {
    element.style.display = theme === "dark" ? "" : "none";
  });

  try {
    updateThemeImageNew(theme);
  } catch (error) {
    console.error('Error in updateThemeImageNew:', error);
  } finally {
    updateThemeImage(theme);
  }
}

function handleSystemThemeChange(e) {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return; // Don't override user preference

  const theme = e.matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeElementsVisibility();
  switchFavicon(theme);
}

const setSystemTheme = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = isDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeElementsVisibility();
  switchFavicon(theme);
};

class underFooter extends HTMLElement {
  constructor() {
    super();
    this.ensureSvgIconLoaded().then(() => {
      this.innerHTML = footerTemplate;
      this.initializeThemeToggle();
      this.handleSubscribe();
    });
  }

  async ensureSvgIconLoaded() {
    if (!customElements.get('svg-icon')) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@rnbws/svg-icon.js/dist/svg-icon.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return Promise.resolve();
  }

  initializeThemeToggle() {
    const themeToggle = this.querySelector('#theme-toggle');
    const themeName = this.querySelector('#theme-name');

    if (themeToggle && themeName) {
      const storedTheme = localStorage.getItem("theme");
      themeName.textContent = storedTheme || "system";

      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }

    updateThemeElementsVisibility();
  }
  handleSubscribe() {

    const subscribeButton = document.getElementById('subscribeButton');

    if (!subscribeButton) return;
    subscribeButton.addEventListener('click', (e) => {

      const subscribeForm = document.getElementById('subscribeForm');
      subscribeForm.classList.toggle('hidden');
      //focus on input
      const emailInput = document.getElementById('emailInput');
      emailInput.focus();

      //hide this button
      e.target.style.display = 'none';

      // Add event listener to email input for validation
      emailInput.addEventListener('input', () => {
        const submitButtonIcon = subscribeForm.querySelector('#submit-newsletter');
        if (emailInput.validity.valid && emailInput.value) {
          submitButtonIcon.classList.remove('hidden');
        } else {
          submitButtonIcon.classList.add('hidden');
        }
      });

      const submitButton = document.getElementById('submit-newsletter');
      submitButton.addEventListener('click', () => {
        e.target.style.display = 'block';
        subscribeForm.classList.add('hidden');
        e.target.innerHTML = 'Thanks for subscribing!';
        e.target.style.pointerEvents = 'none';
        window.open('https://store.weareunder.design/pages/newsletter?email=' + emailInput.value);
      });
    });
  }
}

customElements.define("under-footer", underFooter);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);

const currentYear = new Date().getFullYear();
try {
  document.getElementById("year").innerHTML += currentYear;
} catch (error) {
  console.error('Error in setting year:', error);
}

document.addEventListener('DOMContentLoaded', function () {
  const themeName = document.querySelector("#theme-name");
  if (themeName) {
    const storedTheme = localStorage.getItem("theme");
    themeName.textContent = storedTheme || "system";
  }
});

function toggleTheme() {
  const themeName = document.querySelector("#theme-name");
  if (!themeName) return;

  switch (themeName.textContent) {
    case "system":
      document.documentElement.setAttribute("data-theme", "light");
      themeName.textContent = "light";
      localStorage.setItem("theme", "light");
      break;
    case "light":
      document.documentElement.setAttribute("data-theme", "dark");
      themeName.textContent = "dark";
      localStorage.setItem("theme", "dark");
      break;
    case "dark":
      localStorage.removeItem("theme");
      themeName.textContent = "system";
      setSystemTheme();
      break;
  }
  updateThemeElementsVisibility();
}

function switchFavicon(theme) {
  const link = document.querySelector("link[rel*='icon']");
  if (link && link.href.includes('favico.svg')) {
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = `https://rnbw.design/images/favicon-${theme}.png`;
  }
}

function updateThemeImage(theme) {
  const image = document.getElementById('theme-image');
  const footerLogo = document.querySelector('img[src*="underfooter"]');

  if (image) {
    image.src = theme === 'dark' ? 'images/guide-dark.png' : 'images/guide-light.png';
  }
  if (footerLogo) {
    footerLogo.src = `https://rnbw.design/images/under/underfooter-${theme}.svg`;
  }
}

function updateThemeImageNew(theme) {
  const image = document.getElementById('theme-image-new');
  if (image) {
    if (theme === 'dark') {
      image.src = 'images/new-dark.svg';
    } else {
      image.src = 'images/new-light.svg';
    }
  }
}

