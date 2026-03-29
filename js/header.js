function preloadImages() {
  const imageUrls = [
    "/work/moonshot/01.png",
    "/work/glilotcapital/12.png",
    "/work/able/03.png",
    "/work/handy/00.png",
    "/work/chargeflow/00.png",
    "/work/aim/0.png",
    "/work/artac/0.png",
    "/work/bounce/0.png",
    "/work/rnbw/1.png",
    "/work/spacetop/0.png",
    "/work/blockaid/0.png",
    "/work/soli/19.png",
    "/work/justripe/09.png",
    "/work/utila/0.png",
    "/work/balance/0.png",
    "/work/visioncamp/6.png",
    "/work/dymension/0.png",
    "/work/finaloop/0.png",
    "/work/groundcover/0.png",
    "/work/nilus/0.png",
    "/work/raftt/0.png",
    "/work/togetherr/0.png",
    "/work/upword/0.png",
    "/work/everafter/0.png",
    "/work/faintlines/0.png",
    "/work/grain/0.png",
    "/work/healthquarters/0.png",
    "/work/karma/0.png",
    "/work/mesh_payments/0.svg",
    "/work/notch/0.png",
    "/work/perdiem/0.png",
    "/work/reeco/0.png",
    "/work/reflect/0.png",
    "/work/revelations/0.png",
    "/work/unit/0.png",
    "/work/zigi/0.svg",
    "/work/zoog/0.png",
    "/work/pointfive/0.png",
    "/work/wonderful/00.png",
    "/work/atlit/48.png",
    "/work/bridge/17.png",
  ];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

window.addEventListener('load', preloadImages);

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

    .sidebar-project-image {
      display: none;
      transition-property: all;
      transition-duration: 250ms;
      transition-timing-function: ease;
      width: 100%;
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
<div class="column align-center gap-xs">
<img src="/images/header/brandsprint.svg">
<span class="text-m" style="text-decoration: none; display: none; color: white;">brandsprint</span> 
</div>
</a>
<a class="header-link" style="cursor: pointer" href="/store/" data-page="store">
<div class="column align-center gap-xs" style="position:relative">
<span style="position:relative"><img src="/images/header/store.svg"><span id="cart-count" class="text-l" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;color:white;mix-blend-mode:difference;padding-top:16px;text-decoration:none"></span></span>
<span class="text-m" style="text-decoration: none; display: none; color: white;">store</span>
</div>
</a>
<a class="header-link" style="cursor: pointer" id="nav-work" data-page="design">
<div class="column align-center gap-xs">
<img src="/images/header/design.svg">
<span class="text-m" style="text-decoration: none; display: none; color: white;">design</span>
</div>
</a>
</div>
</div>


<div id="works-wrapper" class="hidden">
<div class="view row no-pointer" style="position: relative; z-index: 999; background-repeat: no-repeat; background-size: cover; background-position: center; background-image: url('../work/utila/0.png');" id="brand-sprints-section">
<div class="sidebar column has-pointer" data-ix="sidebar" id="sidebar-work">
  <a href="/work/moonshot/" class="sidebar-project-link" id="moonshot-000000">moonshot</a>
  <a href="/work/bridge/" class="sidebar-project-link" id="bridge-000000">bridge</a>
  <a href="/work/glilotcapital/" class="sidebar-project-link" id="glilotcapital-1B0CDB">glilot capital</a>
  <a href="/work/atlit/" class="sidebar-project-link" id="atlit-F7410F">atlit</a>
  <a href="/work/able/" class="sidebar-project-link" id="able-E03500">able</a>
  <a href="/work/wonderful/" class="sidebar-project-link" id="wonderful-000000">wonderful</a>
  <a href="/work/handy/" class="sidebar-project-link" id="handy-846642">handy</a>
  <a href="/work/nilus/" class="sidebar-project-link" id="nilus-db160d">nilus</a>
  <a href="/work/utila/" class="sidebar-project-link" id="utila-00794E">utila</a>
  <a href="/work/spacetop/" class="sidebar-project-link" id="spacetop-1E1E1E">spacetop</a>
  <a href="/work/blockaid/" class="sidebar-project-link" id="blockaid-FF4500">blockaid</a>
  <a href="/work/visioncamp/" class="sidebar-project-link" id="visioncamp-0700FD">visioncamp</a>
  <a href="/work/balance/" class="sidebar-project-link" id="balance-1d1d1d">balance</a>
  <a href="/work/finaloop/" class="sidebar-project-link" id="finaloop-FF0000">finaloop</a>
  <a href="/work/dymension/" class="sidebar-project-link" id="dymension-24201F">dymension</a>
  <a href="/work/pointfive/" class="sidebar-project-link" id="pointfive-0216C9">pointfive</a>
  <a href="/work/rnbw/" class="sidebar-project-link" id="rnbw-000000">rnbw</a>
  <a href="/work/bounce/" class="sidebar-project-link" id="bounce-03542C">bounce</a>
  <a href="/work/soli/" class="sidebar-project-link" id="soli-FF8A00">soli</a>
  <a href="/work/togetherr/" class="sidebar-project-link" id="togetherr-000000">togetherr</a>
  <a href="/work/groundcover/" class="sidebar-project-link" id="groundcover-1BB485">groundcover</a>
  <a href="/work/raftt/" class="sidebar-project-link" id="raftt-0C6BEA">raftt</a>
  <a href="/work/justripe/" class="sidebar-project-link" id="justripe-221C35">justripe</a>
  <a href="/work/everafter/" class="sidebar-project-link" id="everafter-FF7051">everafter</a>
  <a href="/work/faintlines/" class="sidebar-project-link" id="faintlines-FF0DBD">faintlines</a>
  <a href="/work/grain/" class="sidebar-project-link" id="grain-FED164">grain</a>
  <a href="/work/healthquarters/" class="sidebar-project-link" id="healthquarters-0E305A">healthquarters</a>
  <a href="/work/chargeflow/" class="sidebar-project-link" id="chargeflow-0B41FC">chargeflow</a>
  <a href="/work/aim/" class="sidebar-project-link" id="aim-008000">aim</a>
  <a href="/work/artac/" class="sidebar-project-link" id="artac-808080">artac</a>
  <a href="/work/karma/" class="sidebar-project-link" id="karma-FCAC8B">karma</a>
  <a href="/work/mesh_payments/" class="sidebar-project-link" id="mesh_payments-19F08B">mesh payments</a>
  <a href="/work/notch/" class="sidebar-project-link" id="notch-CF6AFF">notch</a>
  <a href="/work/perdiem/" class="sidebar-project-link" id="perdiem-0171EA">perdiem</a>
  <a href="/work/reeco/" class="sidebar-project-link" id="reeco-0FCB71">reeco</a>
  <a href="/work/reflect/" class="sidebar-project-link" id="reflect-D1A8FD">reflect</a>
  <a href="/work/revelations/" class="sidebar-project-link" id="revelations-000000">revelations</a>
  <a href="/work/upword/" class="sidebar-project-link" id="upword-B8A4FD">upword</a>
  <a href="/work/unit/" class="sidebar-project-link" id="unit-000000">unit</a>
  <a href="/work/zigi/" class="sidebar-project-link" id="zigi-22D285">zigi</a>
  <a href="/work/zoog/" class="sidebar-project-link" id="zoog-FF7051">zoog</a>
</div>
</div>
</div>

<div id="main-content">
<div class="projects">
<img src="/work/moonshot/01.png" class="sidebar-project-image" id="moonshot" loading="lazy"></img>
<img src="/work/bridge/17.png" class="sidebar-project-image" id="bridge" loading="lazy"></img>
<img src="/work/glilotcapital/12.png" class="sidebar-project-image" id="glilotcapital" loading="lazy"></img>
<img src="/work/able/07.png" class="sidebar-project-image box-l" id="able" loading="lazy"></img>
<img src="/work/handy/00.png" class="sidebar-project-image box-l" id="handy" loading="lazy"></img>
<img src="/work/nilus/0.png" class="sidebar-project-image" id="nilus" loading="lazy"></img>
<img src="/work/wonderful/00.png" class="sidebar-project-image" id="wonderful" loading="lazy"></img>
<img src="/work/utila/0.png" class="sidebar-project-image box-l" id="utila" loading="lazy"></img>
<img src="/work/spacetop/0.png" class="sidebar-project-image" id="spacetop" loading="lazy"></img>
<img src="/work/blockaid/0.png" class="sidebar-project-image" id="blockaid" loading="lazy"></img>
<img src="/work/visioncamp/6.png" class="sidebar-project-image box-l" id="visioncamp" loading="lazy"></img>
<img src="/work/balance/0.png" class="sidebar-project-image box-l" id="balance" loading="lazy"></img>
<img src="/work/finaloop/0.png" class="sidebar-project-image" id="finaloop" loading="lazy"></img>
<img src="/work/dymension/0.png" class="sidebar-project-image" id="dymension" loading="lazy"></img>
<img src="/work/pointfive/0.png" class="sidebar-project-image" id="pointfive" loading="lazy"></img>
<img src="/work/rnbw/1.png" class="sidebar-project-image" id="rnbw" loading="lazy"></img>
<img src="/work/bounce/0.png" class="sidebar-project-image" id="bounce" loading="lazy"></img>
<img src="/work/soli/19.png" class="sidebar-project-image box-l" id="soli" loading="lazy"></img>
<img src="/work/togetherr/0.png" class="sidebar-project-image" id="togetherr" loading="lazy"></img>
<img src="/work/groundcover/0.png" class="sidebar-project-image" id="groundcover" loading="lazy"></img>
<img src="/work/raftt/0.png" class="sidebar-project-image" id="raftt" loading="lazy"></img>
<img src="/work/justripe/09.png" class="sidebar-project-image box-l" id="justripe" loading="lazy"></img>
<img src="/work/everafter/0.png" class="sidebar-project-image" id="everafter" loading="lazy"></img>
<img src="/work/faintlines/0.png" class="sidebar-project-image" id="faintlines" loading="lazy"></img>
<img src="/work/grain/0.png" class="sidebar-project-image" id="grain" loading="lazy"></img>
<img src="/work/healthquarters/0.png" class="sidebar-project-image" id="healthquarters" loading="lazy"></img>
<img src="/work/chargeflow/00.png" class="sidebar-project-image" id="chargeflow" loading="lazy"></img>
<img src="/work/aim/0.png" class="sidebar-project-image" id="aim" loading="lazy"></img>
<img src="/work/artac/0.png" class="sidebar-project-image" id="artac" loading="lazy"></img>
<img src="/work/karma/0.png" class="sidebar-project-image" id="karma" loading="lazy"></img>
<img src="/work/mesh_payments/0.svg" class="sidebar-project-image" id="mesh_payments" loading="lazy"></img>
<img src="/work/notch/0.png" class="sidebar-project-image" id="notch" loading="lazy"></img>
<img src="/work/perdiem/0.png" class="sidebar-project-image" id="perdiem" loading="lazy"></img>
<img src="/work/reeco/0.png" class="sidebar-project-image" id="reeco" loading="lazy"></img>
<img src="/work/reflect/0.png" class="sidebar-project-image" id="reflect" loading="lazy"></img>
<img src="/work/revelations/0.png" class="sidebar-project-image" id="revelations" loading="lazy"></img>
<img src="/work/upword/0.png" class="sidebar-project-image" id="upword" loading="lazy"></img>
<img src="/work/unit/0.png" class="sidebar-project-image" id="unit" loading="lazy"></img>
<img src="/work/zigi/0.svg" class="sidebar-project-image" id="zigi" loading="lazy"></img>
<img src="/work/zoog/0.png" class="sidebar-project-image" id="zoog" loading="lazy"></img>
<img src="/work/atlit/48.png" class="sidebar-project-image" id="atlit" loading="lazy"></img>
</div>
    `;

  class UnderNavigation extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = TEMPLATE;
    }
  }
  customElements.define("under-navigation", UnderNavigation);





  $(".sidebar").on("mouseout", function () {
    document.body.style.overflow = "auto";
  });

  $("#nav-work").on("click", function () {
    window.scrollTo({ top: 0 });
    $(".hero-section").css("display", "none");
    $("#under-nav").css("display", "none");
    $("#works-wrapper").css("display", "block");
    $("#body-content").css("display", "none");
  });

  $("#sidebar-work").on("mouseleave", function () {
    $(".hero-section").css("display", "block");
    $("#under-nav").css({
      "display": "flex"
    });
    $("#works-wrapper").css("display", "none");
    $("#body-content").css("display", "block");
  });

  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header-link');

    navLinks.forEach(link => {
      const dataPage = link.getAttribute('data-page');
      link.classList.remove('active');

      // Only set active if we're not on the homepage
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

  $(".header-link").on("mouseover", function () {
    const img = $(this).find("img");
    const originalSrc = img.attr("src");

    if (!$(this).hasClass('active')) {
      img.attr("src", originalSrc.replace(".svg", "h.svg"));
      $(this).find(".text-m").css("display", "block");
    } else {
      $(this).find(".text-m").css("display", "block");
    }
  }).on("mouseout", function () {
    const img = $(this).find("img");
    const originalSrc = img.attr("src");

    if (!$(this).hasClass('active')) {
      img.attr("src", originalSrc.replace("h.svg", ".svg"));
      $(this).find(".text-m").css("display", "none");
    } else {
      $(this).find(".text-m").css("display", "none");
    }
  });

  setActiveNavItem();
}

async function SideBarFunctionality() {
  "use strict";

  const sidebar = document.getElementsByClassName("sidebar")[0];
  if (sidebar) {
    sidebar.setAttribute("data-ix", "sidebar");
  }
  const rotateMenu = document.getElementsByClassName("work")[0];
  if (rotateMenu) {
    rotateMenu.setAttribute("data-ix", "show-sidebar");
  }

  var Main = function () { };
  Main.main = function () {
    var initTimer = new haxe_Timer(50);
    initTimer.run = function () {
      if (
        window.document.readyState == "interactive" ||
        window.document.readyState == "complete"
      ) {
        Main.init();
        initTimer.stop();
      }
    };
  };
  Main.init = function () {
    Main.heroElement = window.document.getElementById("brand-sprints-section");
    Main.projectsElement =
      window.document.getElementsByClassName("projects")[0];
    Main.sidebarElement = window.document.getElementsByClassName("sidebar")[0];
    
    if (!Main.projectsElement) {
      console.warn("Projects element not found");
      return;
    }
    
    if (!Main.sidebarElement) {
      console.warn("Sidebar element not found");
      return;
    }
    
    if (!Main.heroElement) {
      console.warn("Hero element not found");
      return;
    }
    
    var img_len = Main.projectsElement.children.length;

    var _g21 = 0;
    while (_g21 < img_len) {
      var child1 = Main.projectsElement.children.item(_g21++);
      if (child1.tagName == "IMG") {
        var img = child1;
        var key9 = img.id;
        var _this9 = Main.navLinks.images;
        if (__map_reserved[key9] != null) {
          _this9.setReserved(key9, img);
        } else {
          _this9.h[key9] = img;
        }
      }
    }
    var nav_len = Main.sidebarElement.children.length;
    var _g4 = 0;
    while (_g4 < nav_len) {
      var child2 = Main.sidebarElement.children.item(_g4++);
      if (child2.tagName == "A") {
        var anchor = child2;
        var anID = [anchor.id.split("-")];
        if (anID[0].length == 2) {
          var _this10 = Main.navLinks.anchors;
          var key10 = anID[0][0];
          if (__map_reserved[key10] != null) {
            _this10.setReserved(key10, anchor);
          } else {
            _this10.h[key10] = anchor;
          }
          var this1 = Main.navLinks.colors;
          var value = "#" + anID[0][1].toUpperCase();
          var _this11 = this1;
          var key11 = anID[0][0];
          if (__map_reserved[key11] != null) {
            _this11.setReserved(key11, value);
          } else {
            _this11.h[key11] = value;
          }
          anchor.addEventListener(
            "mouseover",
            (function (anID1) {
              return function () {
                Main.previewProject(anID1[0][0]);
              };
            })(anID)
          );
        }
      }
    }

    new haxe_Timer(24).run = function () {
      if (Main.latestScrollY != window.scrollY) {
        Main.latestScrollY = window.scrollY;
      }
      if (Main.sidebarElement.style.display == "none") {
        if (Main.stopMotionMode == false) {
          Main.stopMotionMode = true;
        }
      } else {
        Main.stopMotionMode = false;
      }
    };
  };

  Main.previewProject = function (id) {
    if (!id) return;
    
    var _this = Main.navLinks.colors;
    if (
      (__map_reserved[id] != null
        ? _this.existsReserved(id)
        : _this.h.hasOwnProperty(id)) == true
    ) {
      var _this1 = Main.navLinks.colors;
      $(".hero-section svg").hide();
      Main.sidebarElement.style.backgroundColor =
        __map_reserved[id] != null ? _this1.getReserved(id) : _this1.h[id];
    }

    var _this2 = Main.navLinks.images;
    if (
      (__map_reserved[id] != null
        ? _this2.existsReserved(id)
        : _this2.h.hasOwnProperty(id)) == true
    ) {
      var _this3 = Main.navLinks.images;
      var newImage =
        __map_reserved[id] != null ? _this3.getReserved(id) : _this3.h[id];

      if (newImage && newImage.src) {
        Main.heroElement.style.backgroundImage = "url(" + newImage.src + ")";
      }
    }
  };

  Main.setStopMotionFrame = function (position, sequence) {
    if (sequence.images.length > 0) {
      var framePos = Math.floor((sequence.images.length - 1) * position);
      Main.heroElement.style.backgroundImage =
        "url(" + sequence.images[framePos].src + ")";
    }
  };
  var Std = function () { };
  Std.parseInt = function (x) {
    var v = parseInt(
      x,
      x && x[0] == "0" && (x[1] == "x" || x[1] == "X") ? 16 : 10
    );
    if (isNaN(v)) {
      return null;
    }
    return v;
  };
  var haxe_IMap = function () { };
  var haxe_Timer = function (time_ms) {
    var me = this;
    this.id = setInterval(function () {
      me?.run();
    }, time_ms);
  };
  haxe_Timer.prototype = {
    stop: function () {
      if (this.id == null) {
        return;
      }
      clearInterval(this.id);
      this.id = null;
    },
    run: function () { },
  };
  var haxe_ds_StringMap = function () {
    this.h = {};
  };
  haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
  haxe_ds_StringMap.prototype = {
    setReserved: function (key, value) {
      if (this.rh == null) {
        this.rh = {};
      }
      this.rh["$" + key] = value;
    },
    getReserved: function (key) {
      if (this.rh == null) {
        return null;
      } else {
        return this.rh["$" + key];
      }
    },
    existsReserved: function (key) {
      if (this.rh == null) {
        return false;
      }
      return this.rh.hasOwnProperty("$" + key);
    },
  };

  var __map_reserved = {};
  Main.latestScrollY = 0;
  Main.relatedScroll = 0;
  Main.stopMotionMode = true;
  Main.animations = [];
  Main.animationMap = new haxe_ds_StringMap();
  Main.navLinks = {
    images: new haxe_ds_StringMap(),
    anchors: new haxe_ds_StringMap(),
    colors: new haxe_ds_StringMap(),
  };
  Main.main();
}

SideBarFunctionality();

addSidebar();
