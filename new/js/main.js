// New Site JS

const lottieAnimations = [
  {
    animation: "https://weareunder.design/animations/animation_1.json",
  },
  {
    animation: "https://weareunder.design/animations/animation_2.json",
  },
  {
    animation: "https://weareunder.design/animations/animation_3.json",
  },
];

const randomIndex = getRandomInt(lottieAnimations.length);
const randomAnimation = lottieAnimations[randomIndex].animation;

//SideBar Functionality.

(function () {
  "use strict";

  const sidebar = document.getElementsByClassName("sidebar")[0];
  if (sidebar) {
    sidebar.setAttribute("data-ix", "sidebar");
  }
  const rotateMenu = document.getElementsByClassName("work")[0];
  if (rotateMenu) {
    rotateMenu.setAttribute("data-ix", "show-sidebar");
  }
  const bigbutton = document.getElementsByClassName("bigbutton")[0];
  if (bigbutton) {
    bigbutton.setAttribute("data-ix", "circlebutton");
  }

  var Main = function () {};
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
    Main.heroElement =
      window.document.getElementsByClassName("hero-section")[0];
    Main.projectsElement =
      window.document.getElementsByClassName("projects")[0];
    Main.sidebarElement = window.document.getElementsByClassName("sidebar")[0];

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
        Main.updateScroll();
      }
      if (Main.sidebarElement.style.display == "none") {
        if (Main.stopMotionMode == false) {
          Main.stopMotionMode = true;
          Main.updateScroll();
        }
      } else {
        Main.stopMotionMode = false;
      }
    };
    Main.updateScroll();
  };

  Main.updateScroll = function () {
    Main.hideProjects();
  };
  Main.previewProject = function (id) {
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
      Main.heroElement.style.backgroundImage =
        "url(" +
        (__map_reserved[id] != null ? _this3.getReserved(id) : _this3.h[id])
          .src +
        ")";
      $(".hero-section").addClass("show-project");
    }
  };
  Main.hideProjects = function () {
    $(".hero-section svg").show();
    $(".hero-section").css("background-image", "none");
    $(".hero-section").removeClass("show-project");
  };
  Main.setStopMotionFrame = function (position, sequence) {
    if (sequence.images.length > 0) {
      var framePos = Math.floor((sequence.images.length - 1) * position);
      Main.heroElement.style.backgroundImage =
        "url(" + sequence.images[framePos].src + ")";
    }
  };
  var Std = function () {};
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
  var haxe_IMap = function () {};
  var haxe_Timer = function (time_ms) {
    var me = this;
    this.id = setInterval(function () {
      me.run();
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
    run: function () {},
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
})();

// Projects Sidebar
$(".circle-work").on("click", function () {
  $(".sidebar").css({
    display: "flex",
  });
  $("#menu-wrapper").css({
    display: "none" + " ",
  });
  $("#logo").css({
    display: "none" + " ",
  });
  $(".circle").css({
    display: "none" + " ",
  });
});

$(".sidebar").on("mouseover", function () {
  $(".sidebar").css({
    display: "flex" + " ",
  });
  $("#menu-wrapper").css({
    display: "none" + " ",
  });
  $("#logo").css({
    display: "none" + " ",
  });
  $(".circle").css({
    display: "none" + " ",
  });
});

$(".sidebar").on("mouseout", function () {
  $(".sidebar").css({
    display: "none" + " ",
  });
  $("#menu-wrapper").css({
    display: "flex" + " ",
  });
  $("#logo").css({
    display: "block" + " ",
  });
  $(".circle").css({
    display: "flex" + " ",
  });
});

$(".close-menu").on("click", function () {
  $(".sidebar").css({
    display: "none" + " ",
  });

  $("#menu-wrapper").css({
    display: "flex",
  });

  $("#logo").css({
    display: "block" + " ",
  });
  $(".circle").css({
    display: "none" + " ",
  });
});

const ScrollLottie = (obj) => {
  let anim = lottie.loadAnimation({
    container: document.querySelector(obj.target),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: obj.path,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  let timeObj = { currentFrame: 0 };
  let endString =
    obj.speed === "slow"
      ? "+=2000"
      : obj.speed === "medium"
      ? "+=1000"
      : obj.speed === undefined
      ? "+=1250"
      : "+=500";
  ScrollTrigger.create({
    trigger: obj.target,
    scrub: true,
    pin: true,
    start: "top top",
    end: endString,
    onUpdate: (self) => {
      if (obj.duration) {
        gsap.to(timeObj, {
          duration: obj.duration,
          currentFrame: Math.floor(self.progress * (anim.totalFrames - 1)),
          onUpdate: () => {
            anim.goToAndStop(timeObj.currentFrame, true);
          },
          ease: "expo",
        });
      } else {
        anim.goToAndStop(self.progress * (anim.totalFrames - 1), true);
      }
    },
  });
};

ScrollLottie({
  target: ".hero-section",
  path: randomAnimation,
  duration: 0.1,
  speed: "medium",
});

//Implemented count to call resize for n number of times to prevent infinite triggering of resize.
var count = 0;

const resizerInterval = setInterval(function () {
  if (count < 50) {
    window.dispatchEvent(new Event("resize"));
    count++;
  } else clearInterval(resizerInterval);
}, 100);

const animations = $(".lottie-animation");
animations.map((index, item) => {
  lottie.loadAnimation({
    container: item,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: $(item).attr("animation"),
  });
});

//Replaced previous method as it was taking min max where min was always 0, so it was vague to use it. And it was trying to generate it randomly with manual code even though we have random number generation functions already available to do so.
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
