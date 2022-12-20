// New Site JS

const lottieAnimations = [
  {
    animation: "./animations/animation_1.json.gz",
  },
  {
    animation: "./animations/animation_2.json.gz",
  },
  {
    animation: "./animations/animation_3.json.gz",
  },
];

const randomIndex = getRandomInt(lottieAnimations.length);
const randomAnimation = lottieAnimations[randomIndex].animation;

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
  document.body.style.overflow = "hidden";
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
  document.body.style.overflow = "hidden";
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
  document.body.style.overflow = "auto";
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
    display: "flex" + " ",
  });

  document.body.style.overflow = "auto";
});

const ScrollLottie = (obj) => {
  // let anim = lottie.loadAnimation({
  //   container: document.querySelector(obj.target),
  //   renderer: "svg",
  //   loop: false,
  //   autoplay: false,
  //   path: obj.path,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // });

  fetch(obj.path)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      // decompress the buffer using pako
      const decompressed = pako.inflate(buffer);
      // convert the decompressed buffer to a string
      const string = new TextDecoder("utf-8").decode(decompressed);
      // convert the string to a JSON object
      const json = JSON.parse(string);

      // load lottie animation
      let anim = lottie.loadAnimation({
        container: document.querySelector(obj.target),
        animationData: json,
        renderer: "svg",
        loop: false,
        autoplay: true,
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

window.addEventListener("resize", () => {
  setInterval(function () {
    if (count < 50) {
      window.dispatchEvent(new Event("resize"));
      count++;
    } else clearInterval(resizerInterval);
  }, 100);
});
const animations = $(".lottie-animation");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
