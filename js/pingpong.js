window.pingPongVars = window.pingPongVars || {
    dot: null,
    container: null,
    containerBounds: null,
    xMax: null,
    xMin: null,
    yMax: null,
    yMin: null,
    tweens: {},
    cachedElements: new Map(),
    animationFrame: null,
    balls: [],
    isPaused: false
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

// This function ensures that a given ball is fully inside its container
function ensureInsideContainer(ball) {
    const container = window.pingPongVars.container || document.querySelector('.ping-pong');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    let deltaX = 0, deltaY = 0;
    
    if (ballRect.left < containerRect.left) {
        deltaX = containerRect.left - ballRect.left;
    } else if (ballRect.right > containerRect.right) {
        deltaX = containerRect.right - ballRect.right;
    }
    
    if (ballRect.top < containerRect.top) {
        deltaY = containerRect.top - ballRect.top;
    } else if (ballRect.bottom > containerRect.bottom) {
        deltaY = containerRect.bottom - ballRect.bottom;
    }
    
    // Parse any existing translation and add the delta adjustments
    let currentX = 0, currentY = 0;
    const transform = ball.style.transform;
    if (transform) {
        const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
            currentX = parseFloat(match[1]);
            currentY = parseFloat(match[2]);
        }
    }
    ball.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px)`;
}

function startAnimationLoop() {
    const vars = window.pingPongVars;
    if (vars.animationFrame) return; // Already running
    
    function animate() {
        if (vars.isPaused) {
            vars.animationFrame = requestAnimationFrame(animate);
            return;
        }
        
        vars.balls.forEach(ball => {
            if (!ball.isHovered) {
                updateBallPosition(ball);
            }
        });
        
        // Check collisions less frequently for better performance
        if (vars.balls.length > 1) {
            vars.balls.forEach(ball => {
                if (!ball.isHovered) {
                    resolveCollision(ball);
                }
            });
        }
        
        vars.animationFrame = requestAnimationFrame(animate);
    }
    
    vars.animationFrame = requestAnimationFrame(animate);
}

function stopAnimationLoop() {
    const vars = window.pingPongVars;
    if (vars.animationFrame) {
        cancelAnimationFrame(vars.animationFrame);
        vars.animationFrame = null;
    }
}

function setupBallInteraction(element) {
    element.isHovered = false;
    
    const mouseEnterHandler = () => {
        element.isHovered = true;
    };
    
    const mouseLeaveHandler = () => {
        element.isHovered = false;
    };
    
    element.addEventListener("mouseenter", mouseEnterHandler);
    element.addEventListener("mouseleave", mouseLeaveHandler);
    
    // Store handlers for cleanup
    element._pingpongHandlers = { mouseEnterHandler, mouseLeaveHandler };
}

function initializeCircles() {
    try {
        const vars = window.pingPongVars;
        const circles = document.querySelectorAll('[class*="circle"]');
        
        // Clear previous balls and stop animation
        stopAnimationLoop();
        vars.balls = [];
        
        // Cache container element and bounds
        vars.container = document.querySelector(".ping-pong");
        if (!vars.container) return;
        
        vars.containerBounds = vars.container.getBoundingClientRect();
        
        circles.forEach(circle => {
            updatePlayground(circle);
            // Ensure the ball starts inside the container
            ensureInsideContainer(circle);
            // Reduced velocity by 50% (from 3,2 to 1.5,1)
            circle.velocity = { x: 2, y: 2 };
            
            // Cache element dimensions to avoid repeated getBoundingClientRect calls
            const rect = circle.getBoundingClientRect();
            circle._cachedDimensions = {
                width: rect.width,
                height: rect.height,
                radius: rect.width / 2
            };
            
            setupBallInteraction(circle);
            vars.balls.push(circle);
        });
        
        if (vars.containerBounds && vars.containerBounds.bottom > 0 && vars.balls.length > 0) {
            startAnimationLoop();
        }
    } catch (err) {
        console.log(err);
    }
}

function updateBallPosition(ball) {
    let currentX = 0;
    let currentY = 0;
    const transform = ball.style.transform;
    if (transform) {
        const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
            currentX = parseFloat(match[1]);
            currentY = parseFloat(match[2]);
        }
    }

    const vars = window.pingPongVars;
    const containerBounds = vars.containerBounds;
    const ballRect = ball.getBoundingClientRect();
    const ballDimensions = ball._cachedDimensions;

    // Calculate next position
    const nextX = currentX + ball.velocity.x;
    const nextY = currentY + ball.velocity.y;
    
    // Calculate ball boundaries for next position
    const nextLeft = ballRect.left - currentX + nextX;
    const nextRight = nextLeft + ballDimensions.width;
    const nextTop = ballRect.top - currentY + nextY;
    const nextBottom = nextTop + ballDimensions.height;

    // Bounce off left/right boundaries
    if (nextLeft <= containerBounds.left || nextRight >= containerBounds.right) {
        ball.velocity.x *= -1;
    }
    // Bounce off top/bottom boundaries
    if (nextTop <= containerBounds.top || nextBottom >= containerBounds.bottom) {
        ball.velocity.y *= -1;
    }

    currentX += ball.velocity.x;
    currentY += ball.velocity.y;
    ball.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

function resolveCollision(ball) {
    const vars = window.pingPongVars;
    const balls = vars.balls;
    
    const ballDimensions = ball._cachedDimensions;
    const ballRect = ball.getBoundingClientRect();
    
    // getBoundingClientRect already includes transforms, so we can use it directly
    const ballCenter = {
        x: ballRect.left + ballDimensions.radius,
        y: ballRect.top + ballDimensions.radius
    };

    balls.forEach(otherBall => {
        if (otherBall === ball || otherBall.isHovered) return;
        
        const otherDimensions = otherBall._cachedDimensions;
        const otherRect = otherBall.getBoundingClientRect();
        
        const otherCenter = {
            x: otherRect.left + otherDimensions.radius,
            y: otherRect.top + otherDimensions.radius
        };

        const dx = ballCenter.x - otherCenter.x;
        const dy = ballCenter.y - otherCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDist = ballDimensions.radius + otherDimensions.radius;

        if (distance < minDist && distance > 0) {
            // Simple velocity exchange for collision
            const tempVelocity = { ...ball.velocity };
            ball.velocity = { ...otherBall.velocity };
            otherBall.velocity = tempVelocity;
            
            // Separate balls to prevent sticking
            const overlap = minDist - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            // Get current transform positions
            let ballX = 0, ballY = 0;
            const ballTransform = ball.style.transform;
            if (ballTransform) {
                const match = ballTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                if (match) {
                    ballX = parseFloat(match[1]);
                    ballY = parseFloat(match[2]);
                }
            }
            
            let otherX = 0, otherY = 0;
            const otherTransform = otherBall.style.transform;
            if (otherTransform) {
                const match = otherTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                if (match) {
                    otherX = parseFloat(match[1]);
                    otherY = parseFloat(match[2]);
                }
            }
            
            // Apply separation
            ball.style.transform = `translate(${ballX + separationX}px, ${ballY + separationY}px)`;
            otherBall.style.transform = `translate(${otherX - separationX}px, ${otherY - separationY}px)`;
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeCircles);

function bringCircleToInitialPosition() {
    const vars = window.pingPongVars;
    vars.balls.forEach(circle => {
        // Instead of resetting to "none", ensure they are well positioned inside the container.
        ensureInsideContainer(circle);
    });
}

function pauseBouncingAnimation() {
    try {
        window.pingPongVars.isPaused = true;
    } catch (err) {
        console.log(err);
    }
}

function restartBouncingAnimation() {
    try {
        window.pingPongVars.isPaused = false;
        if (!window.pingPongVars.animationFrame) {
            startAnimationLoop();
        }
    } catch (err) {
        console.log(err);
    }
}

function cleanupBalls() {
    const vars = window.pingPongVars;
    vars.balls.forEach(ball => {
        if (ball._pingpongHandlers) {
            ball.removeEventListener("mouseenter", ball._pingpongHandlers.mouseEnterHandler);
            ball.removeEventListener("mouseleave", ball._pingpongHandlers.mouseLeaveHandler);
            delete ball._pingpongHandlers;
        }
    });
    vars.balls = [];
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
        // Update container bounds when switching back to desktop
        const vars = window.pingPongVars;
        if (vars.container) {
            vars.containerBounds = vars.container.getBoundingClientRect();
        }
        
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

// Add resize handler to update container bounds when window is resized
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const vars = window.pingPongVars;
        if (vars.container) {
            vars.containerBounds = vars.container.getBoundingClientRect();
            // Ensure balls are still inside after resize
            bringCircleToInitialPosition();
        }
    }, 100);
});
