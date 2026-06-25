/* ============================================================
   PORTFOLIO — Sami Ftaita | script.js
   ============================================================ */

// ── THEME TOGGLE (dark / light) ───────────────────────────────
const themeBtn  = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root      = document.documentElement;

// Restore saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'light' ? 'bx bx-sun' : 'bx bx-moon';

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  themeIcon.className = next === 'light' ? 'bx bx-sun' : 'bx bx-moon';
  localStorage.setItem('theme', next);
});

// ── CUSTOM SMOOTH SCROLL (~380ms, easeInOutQuart) ─────────────
function smoothScrollTo(targetY, duration = 380) {
  const startY = window.scrollY;
  const diff   = targetY - startY;
  let start    = null;

  function ease(t) {
    return t < .5 ? 8*t*t*t*t : 1 - Math.pow(-2*t+2, 4)/2;
  }
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    window.scrollTo(0, startY + diff * ease(p));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function scrollToSection(href) {
  if (href === '#') { smoothScrollTo(0); return; }
  const target = document.querySelector(href);
  if (!target) return;
  const offset = document.getElementById('header').offsetHeight;
  smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - offset);
}

// Intercept all internal anchor clicks
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    scrollToSection(a.getAttribute('href'));
  });
});

// ── NAV REFS ─────────────────────────────────────────────────
const header    = document.getElementById('header');
const menuBtn   = document.getElementById('menu-icon');
const navMobile = document.getElementById('nav-mobile');
const pillLinks = document.querySelectorAll('.nav-pill-link');
const indicator = document.getElementById('nav-indicator');

// ── PILL INDICATOR ────────────────────────────────────────────
function moveIndicator(el) {
  const pill = document.querySelector('.nav-pill');
  if (!el || !pill) return;
  const pr = pill.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  indicator.style.left  = (er.left - pr.left - 4) + 'px';
  indicator.style.width = er.width + 'px';
}

window.addEventListener('load', () => {
  const active = document.querySelector('.nav-pill-link.active');
  indicator.style.transition = 'none';
  // Small delay so the pill renders in its grid position first
  requestAnimationFrame(() => {
    moveIndicator(active);
    requestAnimationFrame(() => {
      indicator.style.transition =
        'left .22s cubic-bezier(.4,0,.2,1), width .22s cubic-bezier(.4,0,.2,1)';
    });
  });
});

// ── MOBILE MENU ──────────────────────────────────────────────
menuBtn.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
});

navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

// ── HEADER SHRINK ON SCROLL ───────────────────────────────────
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── ACTIVE NAV — scroll position based (no IntersectionObserver lag) ──
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const mid = window.scrollY + header.offsetHeight + window.innerHeight * 0.3;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= mid) current = s; });
  if (!current) return;
  pillLinks.forEach(l => {
    const match = l.getAttribute('href') === '#' + current.id;
    l.classList.toggle('active', match);
    if (match) moveIndicator(l);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealIO.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

['.hero-inner', '.hero-visual', '.about-left', '.about-right',
 '.skill-group', '.wcard', '.contact-inner', '.code-window']
  .forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.04}s`;
      revealIO.observe(el);
    });
  });

// ── TERMINAL TYPEWRITER ───────────────────────────────────────
const lines = [
  '> Ready to build something great.',
  '> npm run dev — server started ✓',
  '> All systems operational.',
  '> Open to new opportunities.',
];

const twEl = document.getElementById('typewriter-line');
if (twEl) {
  let li = 0, ci = 0, deleting = false;
  function tick() {
    const line = lines[li];
    if (!deleting) {
      twEl.textContent = line.slice(0, ++ci);
      if (ci === line.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      twEl.textContent = line.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
    }
    setTimeout(tick, deleting ? 22 : 50);
  }
  setTimeout(tick, 800);
}

// ── WCARD mouse glow tracking ─────────────────────────────────
document.querySelectorAll('.wcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

// ── SKILL CHIP hover ──────────────────────────────────────────
document.querySelectorAll('.skill-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.transition = 'background .2s, border-color .2s, transform .15s';
  });
});
