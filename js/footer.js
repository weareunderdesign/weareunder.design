const footerTemplate = `
<footer class="padding-xl box-l">
  <div class="gap-s row align-start box-l">
    <div class="gap-xl row align-start box-l">
      <a class="footer-logo" href="https://weareunder.design/">
        <img src="https://weareunder.design/images/outlinefooter.svg"></img>
      </a>
      <h5 class="box">
        under creates high-quality,<br>
        well-designed, creative brands <br>
        and products for creative people.
      </h5>
      <div class="column gap-xs">
        <a href="https://www.youtube.com/@weareunderdesign">
          <h5>youtube</h5>
        </a>
        <a href="https://store.weareunder.design/pages/newsletter" target="_blank">
          <h5>newsletter</h5>
        </a>
        <a href="mailto:hello@weareunder.design">
          <h5>contact</h5>
        </a>
        <a href="https://weareunder.design/legal">
          <h5>legal</h5>
        </a>
      </div>
      <div class="column align-start gap-xs">
        <a href="https://www.instagram.com/under.design/" target="_blank">
          <h5>instagram</h5>
        </a>
        <a href="https://x.com/underdesign_" target="_blank">
          <h5>twitter</h5>
        </a>
        <a href="https://github.com/weareunderdesign" target="_blank">
          <h5>github</h5>
        </a>
        <a href="#" id="theme-toggle">
          <h5 id="theme-name" class="opacity-l">system</h5>
        </a>
      </div>
    </div>
  </div>
</footer>
`;

function updateThemeElementsVisibility() {
  const bodyTheme = document.body.getAttribute("data-theme");
  if (bodyTheme) return;
 
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
  const bodyTheme = document.body.getAttribute("data-theme");
  if (bodyTheme) return;
  
  let theme;
  if (e.matches) {
    theme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    theme = "light";
    document.documentElement.setAttribute("data-theme", "light");
  }
  updateThemeElementsVisibility();
  switchFavicon(theme);
}
 
const setSystemTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    handleSystemThemeChange({ matches: true });
  } else {
    handleSystemThemeChange({ matches: false });
  }
};
 
class underFooter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = footerTemplate;
  }
 
  connectedCallback() {
    const themeToggle = this.querySelector('#theme-toggle');
    const themeName = this.querySelector('#theme-name');
    
    if (themeToggle && themeName) {
      // Set initial theme name
      const storedTheme = localStorage.getItem("theme");
      themeName.textContent = storedTheme || "system";
      
      // Add click handler
      themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
    
    updateThemeElementsVisibility();
  }
}
 
customElements.define("under-footer", underFooter);
 
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemThemeChange);
 
const currentYear = new Date().getFullYear();
document.getElementById("year").innerHTML += currentYear;
 
document.addEventListener('DOMContentLoaded', function() {
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
      document.documentElement.removeAttribute("data-theme");
      themeName.textContent = "system";
      localStorage.removeItem("theme");
      setSystemTheme();
      break;
  }
  updateThemeElementsVisibility();
}
 
var storedTheme = localStorage.getItem("theme");
 
if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
  themeName.textContent = storedTheme;
  updateThemeElementsVisibility();
} else {
  setSystemTheme();
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
 
setSystemTheme();