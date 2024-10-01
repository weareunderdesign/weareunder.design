function addSidebar() {
  const TEMPLATE = `
    <nav class="box-xs padding-xl" style="
      color: white;
      position: fixed;
      right: 0;
      z-index: 999;
      mix-blend-mode: difference;
      justify-content: space-between;
      flex-wrap: nowrap;
      flex-direction: row-reverse;
    " id="under-nav">

      <span class="header-link" style="cursor: pointer; transition: opacity 0.3s ease;" href="https://weareunder.design/products/">
        <h5>products</h5>
      </span>
      
      <div style="position: relative;">
        <span class="header-link" style="cursor: pointer" id="nav-work">
          <h5>design</h5>
        </span>
        <div id="project-list" style="
          display: none;
          position: absolute;
          color: white;
          left: 0;
          right: 0;
          top: 100%;
          margin-top: 20px;
          flex-direction: row;
          gap: 10px;
          align-items: flex-end;
          opacity: 0;
          transition: opacity 0.3s ease;
        ">
          <div style="display: flex; flex-direction: column; padding-right: 20px;">
            <a href="https://weareunder.design/work/pointfive/">pointfive</a>
            <a href="https://weareunder.design/work/rnbw/">rnbw</a>
            <a href="https://weareunder.design/work/bounce/">bounce</a>
            <a href="https://weareunder.design/work/spacetop/">spacetop</a>
            <a href="https://weareunder.design/work/blockaid/">blockaid</a>
            <a href="https://weareunder.design/work/soli/">soli</a>
            <a href="https://weareunder.design/work/justripe/">justripe</a>
            <a href="https://weareunder.design/work/utila/">utila</a>
            <a href="https://weareunder.design/work/visioncamp/">visioncamp</a>
            <a href="https://weareunder.design/work/balance/">balance</a>
            <a href="https://weareunder.design/work/finaloop/">finaloop</a>
            <a href="https://weareunder.design/work/dymension/">dymension</a>
            <a href="https://weareunder.design/work/groundcover/">groundcover</a>
            <a href="https://weareunder.design/work/nilus/">nilus</a>
            <a href="https://weareunder.design/work/raftt/">raftt</a>
            <a href="https://weareunder.design/work/togetherr/">togetherr</a>
            <a href="https://weareunder.design/work/upword/">upword</a>
            <a href="https://weareunder.design/work/darna/">darna</a>
            <a href="https://weareunder.design/work/everafter/">everafter</a>
          </div>
          <div style="display: flex; flex-direction: column; padding-left: 0px; margin-right: -45px;">
            <a href="https://weareunder.design/work/faintlines/">faintlines</a>
            <a href="https://weareunder.design/work/grain/">grain</a>
            <a href="https://weareunder.design/work/healthquarters/">healthquarters</a>
            <a href="https://weareunder.design/work/iceberg/">iceberg</a>
            <a href="https://weareunder.design/work/karma/">karma</a>
            <a href="https://weareunder.design/work/larosh/">larosh</a>
            <a href="https://weareunder.design/work/le_salon/">le salon</a>
            <a href="https://weareunder.design/work/mesh_payments/">mesh payments</a>
            <a href="https://weareunder.design/work/notch/">notch</a>
            <a href="https://weareunder.design/work/perdiem/">perdiem</a>
            <a href="https://weareunder.design/work/reeco/">reeco</a>
            <a href="https://weareunder.design/work/reflect/">reflect</a>
            <a href="https://weareunder.design/work/tagbox/">tagbox</a>
            <a href="https://weareunder.design/work/revelations/">revelations</a>
            <a href="https://weareunder.design/work/unit/">unit</a>
            <a href="https://weareunder.design/work/unleash/">unleash</a>
            <a href="https://weareunder.design/work/zigi/">zigi</a>
            <a href="https://weareunder.design/work/zoog/">zoog</a>
          </div>
        </div>
      </div>
      
      <a class="header-link" style="cursor: pointer; transition: opacity 0.3s ease;" href="https://store.weareunder.design">
        <h5>store</h5>
      </a>

    </nav>
    <style>
      @media (max-width: 768px) {
        #under-nav {
          margin-top: 70px;
        }
      }
    </style>
  `;

  class UnderNavigation extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = TEMPLATE;
      this.setupHoverEffect();
    }

    setupHoverEffect() {
      const navWork = this.querySelector('#nav-work');
      const projectList = this.querySelector('#project-list');
      const otherLinks = this.querySelectorAll('.header-link:not(#nav-work)');

      navWork.addEventListener('mouseenter', () => {
        projectList.style.display = 'flex';
        setTimeout(() => {
          projectList.style.opacity = '1';
        }, 10);
        otherLinks.forEach(link => {
          link.style.opacity = '0.1';
        });
      });

      navWork.addEventListener('mouseleave', (event) => {
        if (!projectList.contains(event.relatedTarget)) {
          projectList.style.opacity = '0';
          setTimeout(() => {
            projectList.style.display = 'none';
          }, 300);
          otherLinks.forEach(link => {
            link.style.opacity = '1';
          });
        }
      });

      projectList.addEventListener('mouseleave', () => {
        projectList.style.opacity = '0';
        setTimeout(() => {
          projectList.style.display = 'none';
        }, 300);
        otherLinks.forEach(link => {
          link.style.opacity = '1';
        });
      });
    }
  }

  customElements.define("under-navigation", UnderNavigation);
}

addSidebar();