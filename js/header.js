const PROJECTS = [
  { slug: "moonshot", name: "moonshot", color: "#000000", cover: "/work/moonshot/01.png" },
  { slug: "gertrud", name: "gertrud", color: "#2B2A26", cover: "/work/gertrud/06.png" },
  { slug: "bridge", name: "bridge", color: "#008129", cover: "/work/bridge/17.png" },
  { slug: "glilotcapital", name: "glilot capital", color: "#1B0CDB", cover: "/work/glilotcapital/12.png" },
  { slug: "atlit", name: "atlit", color: "#F7410F", cover: "/work/atlit/48.png" },
  { slug: "able", name: "able", color: "#E03500", cover: "/work/able/07.png" },
  { slug: "wonderful", name: "wonderful", color: "#000000", cover: "/work/wonderful/00.png" },
  { slug: "handy", name: "handy", color: "#846642", cover: "/work/handy/00.png" },
  { slug: "nilus", name: "nilus", color: "#DB160D", cover: "/work/nilus/0.png" },
  { slug: "utila", name: "utila", color: "#00794E", cover: "/work/utila/0.png" },
  { slug: "spacetop", name: "spacetop", color: "#1E1E1E", cover: "/work/spacetop/0.png" },
  { slug: "blockaid", name: "blockaid", color: "#FF4500", cover: "/work/blockaid/0.png" },
  { slug: "visioncamp", name: "visioncamp", color: "#0700FD", cover: "/work/visioncamp/6.png" },
  { slug: "balance", name: "balance", color: "#1D1D1D", cover: "/work/balance/0.png" },
  { slug: "finaloop", name: "finaloop", color: "#FF0000", cover: "/work/finaloop/0.png" },
  { slug: "dymension", name: "dymension", color: "#24201F", cover: "/work/dymension/0.png" },
  { slug: "pointfive", name: "pointfive", color: "#0216C9", cover: "/work/pointfive/0.png" },
  { slug: "rnbw", name: "rnbw", color: "#000000", cover: "/work/rnbw/1.png" },
  { slug: "bounce", name: "bounce", color: "#03542C", cover: "/work/bounce/0.png" },
  { slug: "soli", name: "soli", color: "#FF8A00", cover: "/work/soli/19.png" },
  { slug: "togetherr", name: "togetherr", color: "#000000", cover: "/work/togetherr/0.png" },
  { slug: "groundcover", name: "groundcover", color: "#1BB485", cover: "/work/groundcover/0.png" },
  { slug: "raftt", name: "raftt", color: "#0C6BEA", cover: "/work/raftt/0.png" },
  { slug: "justripe", name: "justripe", color: "#221C35", cover: "/work/justripe/09.png" },
  { slug: "everafter", name: "everafter", color: "#FF7051", cover: "/work/everafter/0.png" },
  { slug: "faintlines", name: "faintlines", color: "#FF0DBD", cover: "/work/faintlines/0.png" },
  { slug: "grain", name: "grain", color: "#FED164", cover: "/work/grain/0.png" },
  { slug: "healthquarters", name: "healthquarters", color: "#0E305A", cover: "/work/healthquarters/0.png" },
  { slug: "chargeflow", name: "chargeflow", color: "#0B41FC", cover: "/work/chargeflow/00.png" },
  { slug: "aim", name: "aim", color: "#008000", cover: "/work/aim/0.png" },
  { slug: "artac", name: "artac", color: "#808080", cover: "/work/artac/0.png" },
  { slug: "karma", name: "karma", color: "#FCAC8B", cover: "/work/karma/0.png" },
  { slug: "mesh_payments", name: "mesh payments", color: "#19F08B", cover: "/work/mesh_payments/0.svg" },
  { slug: "notch", name: "notch", color: "#CF6AFF", cover: "/work/notch/0.png" },
  { slug: "perdiem", name: "perdiem", color: "#0171EA", cover: "/work/perdiem/0.png" },
  { slug: "reeco", name: "reeco", color: "#0FCB71", cover: "/work/reeco/0.png" },
  { slug: "reflect", name: "reflect", color: "#D1A8FD", cover: "/work/reflect/0.png" },
  { slug: "revelations", name: "revelations", color: "#000000", cover: "/work/revelations/0.png" },
  { slug: "upword", name: "upword", color: "#B8A4FD", cover: "/work/upword/0.png" },
  { slug: "unit", name: "unit", color: "#000000", cover: "/work/unit/0.png" },
  { slug: "zigi", name: "zigi", color: "#22D285", cover: "/work/zigi/0.svg" },
  { slug: "zoog", name: "zoog", color: "#FF7051", cover: "/work/zoog/0.png" },
];

window.addEventListener("load", () => {
  PROJECTS.forEach(({ cover }) => {
    new Image().src = cover;
  });
});

function addSidebar() {
  const TEMPLATE = `
  <style>
    .sidebar {
      display: block;
      position: absolute;
      right: 0;
      padding: 40px;
      height: 100%;
      flex-direction: column;
      overflow: auto;
      max-height: 100vh;
      scrollbar-width: none;
      -ms-overflow-style: none;
      background-color: rgb(0, 121, 78);
      color: #fff;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .sidebar a {
      display: block;
      margin-bottom: 8px;
    }

    .sidebar-project-link {
      transition-property: color, background-color;
      transition-duration: 200ms;
      transition-timing-function: ease;
    }
    .header-link img {
      width: auto;
      height: auto;
    }

    .logo-mobile {
      display: none;
    }

    @media (max-width: 768px) {
      .logo-full {
        display: none;
      }
      .logo-mobile {
        display: block;
      }
    }

    #under-nav {
      display: flex;
      flex-direction: row;
    }

    @media (max-width: 768px) {
      #under-nav {
        flex-direction: column-reverse;
      }
    }
    
    .no-pointer {
      pointer-events: none;
    }
    
    .has-pointer {
      pointer-events: auto;
    }
  </style>

<div style="display: flex; position: fixed; z-index: 998; mix-blend-mode: difference; justify-content: space-between; width: 100%; align-items: start;" class="padding-xl no-pointer">
      <a href="/" class="has-pointer">
        <img src="/images/header/under.svg" class="logo-full">
        <img src="/images/header/under-mobile.svg" class="logo-mobile">
      </a>


  <div id="under-nav" class="has-pointer">
<a class="header-link" href="/brandsprint/" data-page="brandsprint">
<div class="column align-center justify-center gap-xs">
<img src="/images/header/brandsprint.svg">
<span class="text-m" style="text-decoration: none; display: none; color: white;">brandsprint</span> 
</div>
</a>
<a class="header-link" style="cursor: pointer" href="/store/" data-page="store">
<div class="column align-center justify-center gap-xs" style="position:relative">
<span style="position:relative"><img src="/images/header/store.svg"><span id="cart-count" class="text-l" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;color:white;mix-blend-mode:difference;padding-top:16px;text-decoration:none"></span></span>
<span class="text-m" style="text-decoration: none; display: none; color: white;">store</span>
</div>
</a>
<a class="header-link" href="/underground/" data-page="underground">
<div class="column align-center justify-center gap-xs">
<img src="/images/header/underground.svg">
<span class="text-m" style="text-decoration: none; display: none; color: white;">underground</span>
</div>
</a>
<a class="header-link" style="cursor: pointer" id="nav-work" data-page="design">
<div class="column align-center justify-center gap-xs">
<img src="/images/header/design.svg">
<span class="text-m" style="text-decoration: none; display: none; color: white;">design</span>
</div>
</a>
</div>
</div>


<div id="works-wrapper" class="hidden">
<div class="view row no-pointer" style="position: relative; z-index: 999; background-repeat: no-repeat; background-size: cover; background-position: center; background-image: url('../work/utila/0.png');" id="brand-sprints-section">
<div class="sidebar column has-pointer" data-ix="sidebar" id="sidebar-work">
  ${PROJECTS.map((p) => `<a href="/work/${p.slug}/" class="sidebar-project-link">${p.name}</a>`).join("")}
</div>
</div>
</div>

    `;

  class UnderNavigation extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = TEMPLATE;
    }
  }
  customElements.define("under-navigation", UnderNavigation);

  const display = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.style.display = value;
  };

  document.querySelector(".sidebar").addEventListener("mouseout", () => {
    document.body.style.overflow = "auto";
  });

  document.getElementById("nav-work").addEventListener("click", () => {
    window.scrollTo({ top: 0 });
    display("under-nav", "none");
    display("works-wrapper", "block");
    display("body-content", "none");
  });

  document.getElementById("sidebar-work").addEventListener("mouseleave", () => {
    display("under-nav", "flex");
    display("works-wrapper", "none");
    display("body-content", "block");
  });

  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-link');

    navLinks.forEach(link => {
      const dataPage = link.getAttribute('data-page');
      link.classList.remove('active');

      if (currentPath !== '/' && currentPath.includes(dataPage)) {
        link.classList.add('active');
        const img = link.querySelector('img');
        if (img) {
          const src = img.getAttribute('src');
          img.setAttribute('src', src.replace('.svg', 'h.svg'));
        }
      }
    });
  }

  document.querySelectorAll(".header-link").forEach((link) => {
    const img = link.querySelector("img");
    const label = link.querySelector(".text-m");

    const hover = (labelDisplay, from, to) => () => {
      label.style.display = labelDisplay;
      if (!link.classList.contains("active")) {
        img.setAttribute("src", img.getAttribute("src").replace(from, to));
      }
    };

    link.addEventListener("mouseover", hover("block", ".svg", "h.svg"));
    link.addEventListener("mouseout", hover("none", "h.svg", ".svg"));
  });

  setActiveNavItem();
}

function previewOnHover() {
  const hero = document.getElementById("brand-sprints-section");
  const sidebar = document.getElementById("sidebar-work");

  sidebar.querySelectorAll("a").forEach((anchor, i) => {
    const { color, cover } = PROJECTS[i];
    anchor.addEventListener("mouseover", () => {
      sidebar.style.backgroundColor = color;
      hero.style.backgroundImage = `url(${cover})`;
    });
  });
}

addSidebar();

previewOnHover();

(function() {
  const cartId = localStorage.getItem('cart');
  if (!cartId) return;
  fetch('https://under-design-shop.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': 'b6401a2b2ce8bef08562615388c7d7af' },
    body: JSON.stringify({ query: `{ cart(id:"${cartId}") { totalQuantity } }` })
  }).then(r => r.json()).then(d => {
    const qty = d.data?.cart?.totalQuantity;
    const b = document.getElementById('cart-count');
    if (b && qty) { b.textContent = qty; b.style.display = 'flex'; }
  }).catch(() => {});
})();
