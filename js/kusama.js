const KUSAMA = ['#EC5A29', '#F5CA44', '#F5C2DF', '#7B5BF2', '#014add', '#3F8E45'];

function kusamaRoom() {
  const hero = document.querySelector('.ping-pong');
  if (!hero) return;

  const style = document.createElement('style');
  style.textContent = `
    .kusama-dot { position: absolute; border-radius: 100%; z-index: 4; }
    .kusama-line { position: absolute; left: 40px; bottom: 40px; z-index: 3; line-height: 1.35; color: #000; }
    .kusama-line span { opacity: .5; }
    @media (max-width: 768px) { .kusama-line { left: 20px; bottom: 20px; } }
  `;
  document.head.appendChild(style);

  const line = document.createElement('div');
  line.className = 'kusama-line';
  line.innerHTML = '<span>yayoi kusama 1929&ndash;2026</span><br>cover the world in dots forever';
  hero.appendChild(line);

  let colour = 0;
  let ear = null;

  function pop(size) {
    ear = ear || new (window.AudioContext || window.webkitAudioContext)();
    const at = ear.currentTime;
    const big = (size - 12) / 68;
    const note = 900 - 570 * big;
    const tone = ear.createOscillator();
    const loud = ear.createGain();
    const soft = ear.createBiquadFilter();
    soft.type = 'lowpass';
    soft.frequency.value = 1800;
    tone.type = 'sine';
    tone.frequency.setValueAtTime(note, at);
    tone.frequency.exponentialRampToValueAtTime(note * 1.7, at + 0.07);
    loud.gain.setValueAtTime(0.0001, at);
    loud.gain.exponentialRampToValueAtTime(0.10 - 0.03 * big, at + 0.012);
    loud.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
    tone.connect(soft).connect(loud).connect(ear.destination);
    tone.start(at);
    tone.stop(at + 0.52);
  }


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
    pop(size);
  });
}

function kusamaTape() {
  if (!location.search.includes('record')) return;
  const auto = location.search.includes('auto');

  async function roll() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60 }, audio: true, preferCurrentTab: true, selfBrowserSurface: 'include' });
    const reel = [];
    const tape = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 16e6 });
    tape.ondataavailable = e => reel.push(e.data);
    tape.onstop = () => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(reel, { type: 'video/webm' }));
      link.download = 'kusama.webm';
      link.click();
    };
    tape.start();
    if (auto) hand();
    setTimeout(() => {
      tape.stop();
      stream.getTracks().forEach(t => t.stop());
    }, auto ? 25000 : 30000);
  }

  function hand() {
    const hero = document.querySelector('.ping-pong');
    const room = hero.getBoundingClientRect();
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        hero.dispatchEvent(new PointerEvent('pointerdown', {
          clientX: room.left + 60 + Math.random() * (room.width - 120),
          clientY: room.top + 60 + Math.random() * (room.height - 120),
          pointerType: 'mouse',
          bubbles: true,
        }));
      }, 1200 + i * 380);
    }
  }

  if (auto) return void roll();
  const go = document.createElement('button');
  go.textContent = 'record 30s';
  go.style.cssText = 'position:fixed;top:20px;left:20px;z-index:9999;padding:8px 16px';
  document.body.appendChild(go);
  go.onclick = () => { go.remove(); roll(); };
}

document.addEventListener('DOMContentLoaded', () => { kusamaRoom(); kusamaTape(); });
