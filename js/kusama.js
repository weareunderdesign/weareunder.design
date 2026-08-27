const KUSAMA = {
  colors: ['#EC5A29', '#F5CA44', '#F5C2DF', '#7B5BF2', '#014add', '#3F8E45'],
  key: 'kusama-2026-08-27',
  quote: 'our earth is only one polka dot among a million stars.',
};

function kusamaRoom() {
  const hero = document.querySelector('.ping-pong');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'kusama-canvas';
  const ink = canvas.getContext('2d');

  const line = document.createElement('div');
  line.className = 'kusama-line';
  line.innerHTML = '<span>yayoi kusama 1929&ndash;2026</span><br>she spent her life covering the world in dots. finish it.';

  const style = document.createElement('style');
  style.textContent = `
    .kusama-canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none; }
    .kusama-line { position: absolute; left: 40px; bottom: 40px; z-index: 6; max-width: 22em; line-height: 1.35; color: #111; }
    .kusama-line span { opacity: .5; }
    [data-theme="dark"] .kusama-line { color: #fff; }
    .ping-pong.obliterated video { opacity: 0; }
    @media (max-width: 768px) { .kusama-line { left: 20px; bottom: 20px; } }
  `;

  document.head.appendChild(style);
  hero.appendChild(canvas);
  hero.appendChild(line);

  const dots = load();
  const pending = [];
  let color = 0;
  let covered = 0;
  let painting = false;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load() {
    try { return JSON.parse(localStorage.getItem(KUSAMA.key)) || []; } catch (err) { return []; }
  }

  function keep() {
    try { localStorage.setItem(KUSAMA.key, JSON.stringify(dots)); } catch (err) { }
  }

  function size() {
    const scale = window.devicePixelRatio || 1;
    canvas.width = hero.clientWidth * scale;
    canvas.height = hero.clientHeight * scale;
    ink.setTransform(scale, 0, 0, scale, 0, 0);
    repaint();
  }

  function draw(dot) {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const r = dot.r * Math.min(w, h);
    ink.fillStyle = KUSAMA.colors[dot.c];
    ink.beginPath();
    ink.arc(dot.x * w, dot.y * h, r, 0, Math.PI * 2);
    ink.fill();
  }

  function repaint() {
    ink.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
    covered = 0;
    dots.forEach(dot => { draw(dot); measure(dot); });
    judge();
  }

  function measure(dot) {
    const r = dot.r * Math.min(hero.clientWidth, hero.clientHeight);
    covered += Math.PI * r * r;
  }

  function judge() {
    const room = hero.clientWidth * hero.clientHeight;
    if (covered / room < 1.8) return;
    hero.classList.add('obliterated');
    hero.style.backgroundColor = KUSAMA.colors[(color + 3) % KUSAMA.colors.length];
    line.innerHTML = `<span>${KUSAMA.quote}</span><br>yayoi kusama 1929&ndash;2026`;
  }

  function patch(x, y) {
    if (dots.length > 6000) return;
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const small = Math.min(w, h);
    const c = color++ % KUSAMA.colors.length;
    const seed = (14 + Math.random() * 26) / small;
    const net = [{ x: x / w, y: y / h, r: seed * 1.6, c }];
    const many = 12 + Math.floor(Math.random() * 14);
    for (let i = 0; i < many; i++) {
      const angle = Math.random() * Math.PI * 2;
      const away = seed * (1.6 + Math.random() * 4.4) * small;
      net.push({
        x: (x + Math.cos(angle) * away) / w,
        y: (y + Math.sin(angle) * away) / h,
        r: seed * (0.35 + Math.random() * 0.8),
        c,
      });
    }
    net.forEach(dot => { dots.push(dot); measure(dot); });
    if (still) { net.forEach(draw); judge(); keep(); return; }
    pending.push(...net);
    spread();
  }

  let spreading = null;
  function spread() {
    if (spreading) return;
    spreading = requestAnimationFrame(function step() {
      for (let i = 0; i < 4 && pending.length; i++) draw(pending.shift());
      if (pending.length) return void (spreading = requestAnimationFrame(step));
      spreading = null;
      judge();
      keep();
    });
  }

  let last = null;
  function where(e) {
    const room = hero.getBoundingClientRect();
    const x = e.clientX - room.left;
    const y = e.clientY - room.top;
    if (last && Math.hypot(x - last.x, y - last.y) < 48) return;
    last = { x, y };
    patch(x, y);
  }

  hero.addEventListener('pointerdown', e => {
    last = null;
    where(e);
    painting = e.pointerType === 'mouse';
  });
  hero.addEventListener('pointermove', e => { if (painting) where(e); });
  window.addEventListener('pointerup', () => { painting = false; });

  window.addEventListener('resize', size);
  size();
}

document.addEventListener('DOMContentLoaded', kusamaRoom);
