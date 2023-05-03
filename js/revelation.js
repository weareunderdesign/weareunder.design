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

const ScrollLottie = async (obj) => {
  fetch(obj.path)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      document.getElementsByClassName(obj.target)[0].style.display = "block";
      // decompress the buffer using pako
      const decompressed = pako.inflate(buffer);
      // convert the decompressed buffer to a string
      const string = new TextDecoder("utf-8").decode(decompressed);
      // convert the string to a JSON object
      const json = JSON.parse(string);

      // load lottie animation
      let anim = lottie.loadAnimation({
        container: document.querySelector(`.${obj.target}`),
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

let ellipses = document.getElementsByClassName("ellipse");
let ellipseArray = Array.from(ellipses);

ellipseArray.forEach((element) => {
  element.addEventListener("click", (e) => {
    let id = e.target.id;
    let animationContainer = document.getElementById("animation-container");
    //remove child nodes
    while (animationContainer.firstChild) {
      animationContainer.removeChild(animationContainer.firstChild);
    }
    //remove classname which is eqaul to id
    animationContainer.classList.remove(...animationContainer.classList);
    animationContainer.classList.add(id);
    if (id === "animation-1") {
      (async () =>
        await ScrollLottie({
          target: "animation-1",
          path: lottieAnimations[0].animation,
          duration: 0.1,
          speed: "medium",
        }))();
    } else if (id === "animation-2") {
      (async () =>
        await ScrollLottie({
          target: "animation-2",
          path: lottieAnimations[1].animation,
          duration: 0.1,
          speed: "medium",
        }))();
    } else if (id === "animation-3") {
      (async () =>
        await ScrollLottie({
          target: "animation-3",
          path: lottieAnimations[2].animation,
          duration: 0.1,
          speed: "medium",
        }))();
    }
  });
});
await ScrollLottie({
  target: "animation-1",
  path: lottieAnimations[0].animation,
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
