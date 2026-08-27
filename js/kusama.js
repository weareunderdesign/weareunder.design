const KUSAMA = ['#EC5A29', '#F5CA44', '#F5C2DF', '#7B5BF2', '#014add', '#3F8E45'];

function kusamaRoom() {
  const hero = document.querySelector('.ping-pong');
  if (!hero) return;

  const style = document.createElement('style');
  style.textContent = `
    .kusama-dot { position: absolute; border-radius: 100%; z-index: 4; }
    .kusama-line { position: absolute; left: 40px; bottom: 40px; z-index: 6; line-height: 1.35; color: #111; }
    .kusama-line span { opacity: .5; }
    [data-theme="dark"] .kusama-line { color: #fff; }
    @media (max-width: 768px) { .kusama-line { left: 20px; bottom: 20px; } }
  `;
  document.head.appendChild(style);

  const line = document.createElement('div');
  line.className = 'kusama-line';
  line.innerHTML = '<span>yayoi kusama 1929&ndash;2026</span><br>cover the world in dots.';
  hero.appendChild(line);

  let colour = 0;

  hero.addEventListener('pointerdown', e => {
    const balls = window.pingPongVars.balls;
    if (balls.length > 60) return;

    const room = hero.getBoundingClientRect();
    const size = 12 + Math.random() * 68;
    const dot = document.createElement('div');
    dot.className = 'kusama-dot';
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.left = `${e.clientX - room.left - size / 2}px`;
    dot.style.top = `${e.clientY - room.top - size / 2}px`;
    dot.style.backgroundColor = KUSAMA[colour++ % KUSAMA.length];
    hero.appendChild(dot);

    const heading = Math.random() * Math.PI * 2;
    updatePlayground(dot);
    ensureInsideContainer(dot);
    dot.velocity = { x: Math.cos(heading) * 2, y: Math.sin(heading) * 2 };
    dot._cachedDimensions = { width: size, height: size, radius: size / 2 };
    setupBallInteraction(dot);
    balls.push(dot);
    startAnimationLoop();
  });
}

document.addEventListener('DOMContentLoaded', kusamaRoom);
