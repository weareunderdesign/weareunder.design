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
      <span class="box" style="align-self:flex-end;">
        high-quality, well-designed, <br>
        creative brands and products<br>
         for creative people.
      </span>

      <div class="column gap-s">
        <div class="row gap-xl">
          <div class="column gap-s">
            <a href="https://github.com/weareunderdesign" target="_blank">
              <span>github</span>
            </a>
                        <a href="https://www.instagram.com/under.design/" target="_blank">
              <span>instagram</span>
            </a>
          </div>
        
          <div class="column align-start gap-s">
            <a href="https://x.com/underdesign_" target="_blank">
              <span>x</span>
            </a>

            <a href="https://www.youtube.com/@weareunderdesign">
              <span>youtube</span>
            </a>
          </div>

           <div class="column align-start gap-s">
           <a href="mailto:hello@weareunder.design">
              <span>contact</span>
            </a>
            <a href="#" id="theme-toggle">
              <span id="theme-name" class="opacity-l">system</span>
            </a>
          </div>
        </div>
         <span id="subscribeButton">newsletter</span>
   
         <div style="display:none; flex-direction:row; align-items:center;" id="subscribeForm">
          <input type="email" id="emailInput" placeholder="subscribe" style="outline:none; border:none; max-width:20.5ch; min-width:150px;">
          <span class="hidden" id="submit-newsletter">
            →
          </span>
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
      subscribeForm.style.display = 'flex';
      //focus on input
      const emailInput = document.getElementById('emailInput');
      emailInput.focus();

      //hide this button
      e.target.style.display = 'none';

      // Add event listener to email input for validation
      emailInput.addEventListener('input', () => {
        let chars = emailInput.value.length;

        emailInput.style.width = `${chars}ch`;
        const submitButtonIcon = subscribeForm.querySelector('#submit-newsletter');
        if (emailInput.validity.valid && emailInput.value) {
          submitButtonIcon.classList.remove('hidden');
        } else {
          submitButtonIcon.classList.add('hidden');
        }
      });

      // Add event listener for Enter key press
      emailInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const submitButton = document.getElementById('submit-newsletter');
          submitButton.click();
        }
      });

      // Add event listener for submit button
      const submitButton = document.getElementById('submit-newsletter');
      submitButton.addEventListener('click', () => {
        e.target.style.display = 'block';
        subscribeForm.style.display = 'none';
        e.target.innerHTML = 'thanks for subscribing!';
        e.target.style.pointerEvents = 'none';
        window.open('https://store.weareunder.design/pages/newsletter?email=' + emailInput.value);
      });
    });
  }
}

customElements.define("under-footer", underFooter);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);

const currentYear = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
});

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

