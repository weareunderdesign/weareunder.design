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
<footer class="padding-xl flex width-full">
  <div class="gap-s row align-start flex width-full">
    <div class="gap-xl row align-start flex width-full">
      <a class="footer-logo" href="/">
        <svg width="82" height="99" viewBox="0 0 82 99" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M55.3623 66.5117V24.5879H81.5V97.9102H54.9922L55.1602 86.999C52.6152 90.3939 49.2737 93.0999 45.1445 95.1172C40.4792 97.3964 35.1981 98.5 29.3135 98.5C23.452 98.5 18.569 97.4042 14.1826 95.2021V95.2041L14.124 95.1748L14.123 95.1738V95.1719C9.78616 92.9563 6.40956 89.9591 4.04395 86.1455C1.67025 82.3187 0.500001 78.0991 0.5 73.4404V24.5879H26.667V67.8975C26.667 70.7809 27.213 73.3611 28.2959 75.6758C29.3729 77.9779 30.9578 79.7662 33.002 81.1328C35.0277 82.487 37.3983 83.1709 40.1328 83.1709C43.1674 83.1709 45.8376 82.4546 48.1309 81.0352C50.4288 79.6127 52.1912 77.6498 53.4756 75.1025C54.7578 72.5594 55.3623 69.7196 55.3623 66.5117ZM81.5 0.5V16.3301H0.5V0.5H81.5ZM1.5 15.3301H80.5V1.5H1.5V15.3301ZM56.3623 66.5117C56.3623 69.8491 55.732 72.8478 54.3682 75.5527C53.0065 78.2533 51.1222 80.3589 48.6572 81.8848C46.1877 83.4134 43.3309 84.1709 40.1328 84.1709C37.2225 84.1709 34.6532 83.4399 32.4453 81.9639C30.256 80.5002 28.548 78.5734 27.3906 76.0996C26.239 73.638 25.667 70.9107 25.667 67.8975V25.5879H1.5V73.4404C1.5 77.9213 2.62309 81.9574 4.89453 85.6191C7.15979 89.2708 10.4019 92.156 14.6113 94.2998C18.8439 96.4286 23.5756 97.5 29.3135 97.5C35.0713 97.5 40.1976 96.4208 44.7051 94.2188C49.2175 92.0142 52.7336 88.9768 55.2676 85.1074L56.2119 83.6641L56.0078 96.9102H80.5V25.5879H56.3623V66.5117Z"/></svg>
      </a>
      <span class="flex-1" style="align-self:flex-end;">
        high-quality, well-designed,<br>
        brands and products<br>
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
            <a href="https://www.youtube.com/@weareunderdesign">
              <span>youtube</span>
            </a>
            <a href="mailto:hello@weareunder.design">
              <span>contact</span>
            </a>
          </div>
        </div>
         <span id="subscribeButton">newsletter</span>
   
         <div style="display:none; flex-direction:row; align-items:center;" id="subscribeForm">
          <input type="email" id="emailInput" placeholder="newsletter" style="outline:none; border:none; max-width:20.5ch; min-width:150px;">
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
  connectedCallback() {
    this.innerHTML = footerTemplate;
    this.handleSubscribe();
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
      submitButton.addEventListener('click', async () => {
        const email = emailInput.value;
        try {
          const res = await fetch('https://under-design-shop.myshopify.com/api/2024-01/graphql.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': 'b6401a2b2ce8bef08562615388c7d7af' },
            body: JSON.stringify({ query: `mutation { customerCreate(input: { email: "${email}", acceptsMarketing: true }) { customer { id } customerUserErrors { message } } }` })
          });
          const { data } = await res.json();
          const errors = data?.customerCreate?.customerUserErrors;
          if (errors?.length && !errors.some(e => e.message.includes('has already been taken'))) {
            e.target.style.display = 'block';
            subscribeForm.style.display = 'none';
            e.target.innerHTML = 'something went wrong, try again';
            e.target.style.pointerEvents = 'auto';
          } else {
            e.target.style.display = 'block';
            subscribeForm.style.display = 'none';
            e.target.innerHTML = 'thanks for subscribing!';
            e.target.style.pointerEvents = 'none';
          }
        } catch {
          e.target.style.display = 'block';
          subscribeForm.style.display = 'none';
          e.target.innerHTML = 'something went wrong, try again';
          e.target.style.pointerEvents = 'auto';
        }
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

