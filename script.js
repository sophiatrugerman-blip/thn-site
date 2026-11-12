// Mobile menu (runs on every page)
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const nav = navToggle.closest('.navbar');
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open ? '&#10005;' : '&#9776;';
  });
}

// Quote card (home page only)
if (document.getElementById('quoteInner')) {
  const quotes = [
    {
      text: `"To whomever may be reading this - you are loved, you matter, keep going."`,
      city: "Ann Arbor"
    },
    {
      text: `"Everything happens for a reason, my friends! Even when life gets hard, you are exactly where you are supposed to be. There is always a new adventure around the corner. Take control of your life & practice gratitude everyday."`,
      city: "Tucson"
    },
    {
      text: `"Take long deep breaths. Put your feet in the grass. Drink a glass of water. Hug your favorite people."`,
      city: "Chicago"
    },
    {
      text: `"You are loved for who you are and nothing can ever take that away from you."`,
      city: "New York City"
    }
  ];

  let current = 0;
  let busy = false;

  const inner = document.getElementById('quoteInner');
  const labelEl = document.getElementById('quoteLabel');
  const textEl = document.getElementById('quoteText');
  const dotsEl = document.getElementById('quoteDots');

  quotes.forEach((q, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot';
    dot.setAttribute('aria-label', 'Show quote ' + (i + 1));
    dot.addEventListener('click', () => go(i));
    dotsEl.appendChild(dot);
  });

  function render(i) {
    labelEl.textContent = 'Page from a journal in ' + quotes[i].city;
    textEl.textContent = quotes[i].text;
    Array.from(dotsEl.children).forEach((d, n) => d.classList.toggle('active', n === i));
  }

  function go(next) {
    if (busy || next === current) return;
    busy = true;
    const outClass = next > current ? 'slide-out-left' : 'slide-out-right';
    inner.classList.add(outClass);
    setTimeout(() => {
      current = next;
      render(current);
      inner.classList.remove(outClass);
      busy = false;
    }, 400);
  }

  document.getElementById('nextQuote').addEventListener('click', () => go((current + 1) % quotes.length));
  document.getElementById('prevQuote').addEventListener('click', () => go((current - 1 + quotes.length) % quotes.length));

  render(current);
}

// Intro: the collage crumples away on the first scroll (home page only)
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const root = document.documentElement;
  if (!root.classList.contains('intro-lock')) { intro.remove(); return; }

  const IMG = 'assets/journal-collage.jpg';
  const img = new Image();
  img.src = IMG;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;
  window.scrollTo(0, 0);

  const rand = (a, b) => a + Math.random() * (b - a);

  function finish() {
    intro.remove();
    root.classList.remove('intro-lock');
    window.scrollTo(0, 0);
  }

  function onWheel(e) { if (Math.abs(e.deltaY) > 4) start(); }
  function onKey(e) {
    if (['ArrowDown', 'PageDown', ' ', 'End', 'Enter'].includes(e.key)) {
      e.preventDefault();
      start();
    }
  }
  let touchY = null;
  function onTouchStart(e) { touchY = e.touches[0].clientY; }
  function onTouchMove(e) {
    if (touchY !== null && Math.abs(e.touches[0].clientY - touchY) > 12) start();
  }
  function removeListeners() {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
  }

  function start() {
    if (started) return;
    started = true;
    removeListeners();
    document.getElementById('introHint').style.opacity = '0';
    if (reduceMotion || !intro.animate || !img.complete || !img.naturalWidth) {
      intro.style.transition = 'opacity 0.5s ease';
      intro.style.opacity = '0';
      setTimeout(finish, 520);
      return;
    }
    try { crumple(); } catch (e) { finish(); }
  }

  function crumple() {
    const W = intro.clientWidth, H = intro.clientHeight;
    const cols = Math.max(4, Math.min(8, Math.round(W / 200)));
    const rows = Math.max(3, Math.min(6, Math.round(H / 200)));
    const cw = W / cols, ch = H / rows;

    // Jittered grid of corner points; the outer edge stays put so the sheet is fully covered
    const v = [];
    for (let j = 0; j <= rows; j++) {
      v[j] = [];
      for (let i = 0; i <= cols; i++) {
        const edgeX = i === 0 || i === cols;
        const edgeY = j === 0 || j === rows;
        v[j][i] = [
          i * cw + (edgeX ? 0 : rand(-0.3, 0.3) * cw),
          j * ch + (edgeY ? 0 : rand(-0.3, 0.3) * ch)
        ];
      }
    }

    // Split every cell into two torn-looking triangles
    const tris = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = v[j][i], b = v[j][i + 1], c = v[j + 1][i + 1], d = v[j + 1][i];
        if (Math.random() < 0.5) tris.push([a, b, c], [a, c, d]);
        else tris.push([a, b, d], [b, c, d]);
      }
    }

    // Works out how the collage is scaled to cover the screen, so each piece shows the right part
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const bw = img.naturalWidth * s, bh = img.naturalHeight * s;
    const ox = (W - bw) / 2, oy = (H - bh) / 2;

    const frag = document.createDocumentFragment();
    const shards = [];
    tris.forEach(t => {
      const xs = t.map(p => p[0]), ys = t.map(p => p[1]);
      const left = Math.min(...xs), top = Math.min(...ys);
      const width = Math.max(...xs) - left, height = Math.max(...ys) - top;
      const cx = (xs[0] + xs[1] + xs[2]) / 3, cy = (ys[0] + ys[1] + ys[2]) / 3;

      const el = document.createElement('div');
      el.className = 'shard';
      el.style.cssText =
        'left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;' +
        'background:url(' + IMG + ') ' + (ox - left) + 'px ' + (oy - top) + 'px / ' + bw + 'px ' + bh + 'px no-repeat;' +
        'clip-path:polygon(' + t.map(p => (p[0] - left) + 'px ' + (p[1] - top) + 'px').join(',') + ');' +
        'transform-origin:' + (cx - left) + 'px ' + (cy - top) + 'px;';

      const shade = document.createElement('span');
      shade.className = 'shade';
      shade.style.background =
        'linear-gradient(' + Math.round(rand(0, 360)) + 'deg, rgba(0,0,0,0.5), rgba(255,255,255,0.35))';
      el.appendChild(shade);
      frag.appendChild(el);
      shards.push({ el, shade, cx, cy });
    });

    document.getElementById('introBase').remove();
    intro.appendChild(frag);

    const runs = [];
    shards.forEach(sh => {
      const dx = sh.cx - W / 2, dy = sh.cy - H / 2;
      const ang = Math.atan2(dy, dx);
      const rot1 = rand(-28, 28), sc1 = rand(0.55, 0.9);
      const squashed = 'translate(' + (-dx * 0.55) + 'px,' + (-dy * 0.55) + 'px) rotate(' + rot1 + 'deg) scale(' + sc1 + ')';
      const push = Math.max(W, H) * rand(0.55, 0.95);
      const tx = dx * 1.3 + Math.cos(ang) * push;
      const ty = dy * 1.3 + Math.sin(ang) * push + rand(-0.05, 0.25) * H;
      const burst = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + (rot1 + rand(-140, 140)) + 'deg) scale(' + rand(0.5, 1.15) + ')';
      const timing = { duration: 1900, delay: rand(0, 140), fill: 'forwards' };

      // crumple inward, pause, then scatter outward
      runs.push(sh.el.animate([
        { offset: 0, transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1, easing: 'cubic-bezier(.45,0,.25,1)' },
        { offset: 0.5, transform: squashed, opacity: 1 },
        { offset: 0.58, transform: squashed, opacity: 1, easing: 'cubic-bezier(.12,.7,.3,1)' },
        { offset: 0.82, opacity: 1 },
        { offset: 1, transform: burst, opacity: 0 }
      ], timing));
      // darker, creased look while it crumples
      sh.shade.animate([
        { opacity: 0, offset: 0 },
        { opacity: 0.65, offset: 0.5 },
        { opacity: 0.65, offset: 1 }
      ], timing);
    });

    Promise.all(runs.map(r => r.finished)).then(finish).catch(finish);
  }

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  intro.addEventListener('click', start);
})();

window.addEventListener('pageshow', function (e) {
  if (e.persisted && document.querySelector('.home-hero')) location.reload();
});
