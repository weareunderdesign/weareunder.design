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

const lottieAnimations = ["./animations/about.json"];

const randomAnimation =
  lottieAnimations[getRandomInt(lottieAnimations.length)];

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

//Replaced previous method as it was taking min max where min was always 0, so it was vague to use it. And it was trying to generate it randomly with manual code even though we have random number generation functions already available to do so.
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}