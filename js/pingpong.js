window.pingPongVars = window.pingPongVars || {
    dot: null,
    container: null,
    containerBounds: null,
    xMax: null,
    xMin: null,
    yMax: null,
    yMin: null,
    tweens: {}
};

function updatePlayground(element) {
    const vars = window.pingPongVars;
    vars.dot = element;
    if (!vars.dot) return;
    vars.container = document.querySelector(".ping-pong");
    const dotBounds = vars.dot.getBoundingClientRect();
    vars.containerBounds = vars.container.getBoundingClientRect();
    vars.xMax = vars.containerBounds.right - dotBounds.right;
    vars.xMin = vars.containerBounds.left - dotBounds.left;
    vars.yMax = vars.containerBounds.bottom - dotBounds.bottom;
    vars.yMin = vars.containerBounds.top - dotBounds.top;
}

function animationToElement(element) {
    const vars = window.pingPongVars;
    let gsapTween = gsap.to(element, {
        x: "+=3000",
        y: "+=2000",
        duration: 50,
        repeat: -1,
        repeatRefresh: true,
        ease: "none",
        modifiers: {
            x: bounceModifier(vars.xMin, vars.xMax),
            y: bounceModifier(vars.yMin, vars.yMax),
        },
    });

    element.addEventListener("mouseenter", () => gsapTween.pause());
    element.addEventListener("mouseleave", () => gsapTween.resume());
    
    return gsapTween;
}

function initializeCircles() {
    try {
        const circles = document.querySelectorAll('[class*="circle"]');
        circles.forEach(circle => {
            updatePlayground(circle);
            if (window.pingPongVars.containerBounds && window.pingPongVars.containerBounds.bottom > 0) {
                const id = circle.className;
                window.pingPongVars.tweens[id] = animationToElement(circle);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function bounceModifier(min, max) {
    var range = max - min;
    return function (value) {
        value = parseFloat(value);
        var cycle, clippedValue;
        if (value > max) {
            cycle = (value - max) / range;
            clippedValue = (cycle % 1) * range;
            value = (cycle | 0) & (1 !== 0) ? min + clippedValue : max - clippedValue;
        } else if (value < min) {
            cycle = (min - value) / range;
            clippedValue = (cycle % 1) * range;
            value = (cycle | 0) & (1 !== 0) ? max - clippedValue : min + clippedValue;
        }
        return value + "px";
    };
}

document.addEventListener('DOMContentLoaded', initializeCircles);

function bringCircleToInitialPosition() {
    const circles = document.querySelectorAll('[class*="circle"]');
    circles.forEach(circle => {
        circle.style.transform = "none";
    });
}

function pauseBouncingAnimation() {
    try {
        Object.values(window.pingPongVars.tweens).forEach(tween => tween?.pause());
    } catch (err) {
        console.log(err);
    }
}

function restartBouncingAnimation() {
    try {
        Object.values(window.pingPongVars.tweens).forEach(tween => tween?.restart());
    } catch (err) {
        console.log(err);
    }
}

const pingPongMediaQuery = window.matchMedia("(max-width: 992px)");
pingPongMediaQuery.addEventListener("change", handlePingPongMediaQueryChange);
handlePingPongMediaQueryChange(pingPongMediaQuery);

function handlePingPongMediaQueryChange(mediaQuery) {
    const cta = document.getElementById("cta-animation");
    const brandsprintCircles = document.querySelectorAll(".brand-sprint-circle");
    let circlesArray = Array.from(brandsprintCircles);
    if (mediaQuery.matches) {
        bringCircleToInitialPosition();
        pauseBouncingAnimation();

        if (!!cta) {
            cta.style.display = "none";
        }
        if (!!brandsprintCircles) {
            circlesArray.forEach((circle) => {
                circle.style.display = "none";
            });
        }
    } else {
        bringCircleToInitialPosition();
        restartBouncingAnimation();

        if (!!cta) {
            cta.style.display = "flex";
        }
        if (!!brandsprintCircles) {
            circlesArray.forEach((circle) => {
                circle.style.display = "flex";
            });
        }
    }
}
