let tweenInfo, tweenWork, tweenBrandsprint, tweenUkraine;
let infoElement, workElement, brandsprintElement, ukraineElement;

var dot, container, containerBounds, xMax, xMin, yMax, yMin;

function updatePlayground(class_target) {
  dot = document.querySelector(class_target);
  container = document.querySelector(".hero-section");
  dotBounds = dot.getBoundingClientRect();
  containerBounds = container.getBoundingClientRect();
  xMax = containerBounds.right - dotBounds.right;
  xMin = containerBounds.left - dotBounds.left;
  yMax = containerBounds.bottom - dotBounds.bottom;
  yMin = containerBounds.top - dotBounds.top;
}
function ping(class_target) {
  try {
    updatePlayground(class_target);
    if (containerBounds && containerBounds.bottom > 0) {
      let gsapTween = gsap.to(class_target, {
        x: "+=3000",
        y: "+=2000",
        duration: 100,
        repeat: -1,
        repeatRefresh: true,
        ease: "none",
        modifiers: {
          x: bounceModifier(xMin, xMax),
          y: bounceModifier(yMin, yMax),
        },
      });
      if (class_target === ".circle-info") {
        clearInterval(intervalId1);
        tweenInfo = gsapTween;
        infoElement = document.querySelector(".circle-info");
        infoElement.addEventListener("mouseenter", () => {
          tweenInfo.pause();
        });

        infoElement.addEventListener("mouseleave", () => {
          tweenInfo.resume();
        });
      } else if (class_target === ".circle-work") {
        clearInterval(intervalId2);
        tweenWork = gsapTween;
        workElement = document.querySelector(".circle-work");
        workElement.addEventListener("mouseenter", () => {
          tweenWork.pause();
        });

        workElement.addEventListener("mouseleave", () => {
          tweenWork.resume();
        });
      } else if (class_target === ".circle-brandsprint") {
        clearInterval(intervalId3);
        tweenBrandsprint = gsapTween;

        brandsprintElement = document.querySelector(".circle-brandsprint");

        brandsprintElement.addEventListener("mouseenter", () => {
          tweenBrandsprint.pause();
        });
        brandsprintElement.addEventListener("mouseleave", () => {
          tweenBrandsprint.resume();
        });
      } else if (class_target === ".circle-ukraine") {
        clearInterval(intervalId4);
        tweenUkraine = gsapTween;
        ukraineElement = document.querySelector(".circle-ukraine");
        ukraineElement.addEventListener("mouseenter", () => {
          tweenUkraine.pause();
        });
        ukraineElement.addEventListener("mouseleave", () => {
          tweenUkraine.resume();
        });
      }
    }

    //make x and y go as high (or low) as you want, and the modifier will always keep it within the xMin/xMax and yMin/yMax ranges.
  } catch (err) {
    console.log(err);
  }

  //this function spits back a modifier function that'll keep the value within a range, bouncing off the min/max boundaries.
  function bounceModifier(min, max) {
    var range = max - min;
    return function (value) {
      value = parseFloat(value); // comes in as px, like "10px"
      var cycle, clippedValue;
      if (value > max) {
        cycle = (value - max) / range;
        clippedValue = (cycle % 1) * range;
        value =
          (cycle | 0) & (1 !== 0) ? min + clippedValue : max - clippedValue; //on even cycles, go backwards.
      } else if (value < min) {
        cycle = (min - value) / range;
        clippedValue = (cycle % 1) * range;
        value =
          (cycle | 0) & (1 !== 0) ? max - clippedValue : min + clippedValue; //on even cycles, go backwards.
      }
      return value + "px";
    };
  }
}

var intervalId1 = setInterval(() => ping(".circle-info"), 1000);
var intervalId2 = setInterval(() => ping(".circle-work"), 1000);
var intervalId3 = setInterval(() => ping(".circle-brandsprint"), 1000);
var intervalId4 = setInterval(() => ping(".circle-ukraine"), 1000);

//Setting the circles to their initial position
function bringCircleToInitialPosition() {
  if (infoElement) infoElement.style.transform = "none";
  if (workElement) workElement.style.transform = "none";
  if (brandsprintElement) brandsprintElement.style.transform = "none";
  if (ukraineElement) ukraineElement.style.transform = "none";
}

//Pause Bouncing Animation
function pauseBouncingAnimation() {
  try {
    tweenInfo.pause();
    tweenWork.pause();
    tweenBrandsprint.pause();
    tweenUkraine.pause();
  } catch (err) {
    console.log(err);
  }
}

//Restart Bouncing Animation
function restartBouncingAnimation() {
  try {
    tweenInfo.restart();
    tweenWork.restart();
    tweenBrandsprint.restart();
    tweenUkraine.restart();
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("resize", () => {
  setTimeout(() => {
    if (window.innerWidth < 992) {
      bringCircleToInitialPosition();
      pauseBouncingAnimation();
    } else {
      bringCircleToInitialPosition();
      restartBouncingAnimation();
    }
  }, 500);
  //timeout because resizing event takes time to complete and register the final size.
});
