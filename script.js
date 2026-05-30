/**
 * ANNIVERSARY WEBSITE — script.js
 * ============================================================
 * Table of Contents:
 * 1.  Configuration  ← EDIT THIS SECTION
 * 2.  Utility helpers
 * 3.  Loading screen
 * 4.  Scroll progress bar
 * 5.  Navigation active state
 * 6.  Reveal-on-scroll animations
 * 7.  Hero — days together counter
 * 8.  Countdown timer
 * 9.  Floating hearts canvas
 * 10. Music player
 * 11. Theme toggle (dark / light)
 * 12. Photo gallery lightbox
 * 13. Surprise button
 * 14. Back to top
 * 15. Confetti
 * 16. Easter egg
 * 17. Parallax (hero shapes)
 * 18. Init
 * ============================================================
 */

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION  ← EDIT THESE VALUES
───────────────────────────────────────────────────────────── */
const CONFIG = {
  /**
   * The date your relationship started.
   * Format: 'YYYY-MM-DD'
   * This is used for the hero "days together" counter
   * AND the live countdown timer.
   */
  startDate: '2024-05-31',  // ← CHANGE ME

  /**
   * Number of floating hearts on screen at once.
   * Reduce for lower-power devices.
   */
  maxHearts: 18,

  /**
   * Enable confetti on surprise button click.
   */
  enableConfetti: true,

  /**
   * Number of confetti particles.
   */
  confettiCount: 200,
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITY HELPERS
───────────────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Parse CONFIG.startDate into a JS Date at midnight local time.
 */
function getStartDate() {
  const [y, m, d] = CONFIG.startDate.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/* ─────────────────────────────────────────────────────────────
   3. LOADING SCREEN
───────────────────────────────────────────────────────────── */
function initLoadingScreen() {
  const screen = $('#loading-screen');
  if (!screen) return;

  // Hide loading screen after page resources are ready
  const hide = () => {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 900);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 800);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 600));
  }
}

/* ─────────────────────────────────────────────────────────────
   4. SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────────────────────────
   5. NAVIGATION ACTIVE STATE
───────────────────────────────────────────────────────────── */
function initNavActiveState() {
  const nav     = $('#main-nav');
  const links   = $$('a', nav);
  const sections = $$('section[id]');
  if (!nav || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove('active'));
          const active = links.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ─────────────────────────────────────────────────────────────
   6. REVEAL-ON-SCROLL ANIMATIONS
───────────────────────────────────────────────────────────── */
function initRevealOnScroll() {
  const items = $$('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ─────────────────────────────────────────────────────────────
   7. HERO — DAYS TOGETHER
───────────────────────────────────────────────────────────── */
function initHeroDays() {
  const el = $('#hero-days');
  if (!el) return;

  const start = getStartDate();
  const now   = new Date();
  const ms    = now - start;
  const days  = Math.floor(ms / (1000 * 60 * 60 * 24));
  el.textContent = days >= 0 ? days.toLocaleString() : '0';
}

/* ─────────────────────────────────────────────────────────────
   8. COUNTDOWN TIMER
───────────────────────────────────────────────────────────── */
function initCountdown() {
  const daysEl    = $('#cd-days');
  const hoursEl   = $('#cd-hours');
  const minutesEl = $('#cd-minutes');
  const secondsEl = $('#cd-seconds');
  if (!daysEl) return;

  const start  = getStartDate();
  let prevSecs = -1;

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const diff = Date.now() - start.getTime();
    if (diff < 0) return;

    const totalSecs = Math.floor(diff / 1000);
    const secs  = totalSecs % 60;
    const mins  = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600) % 24;
    const days  = Math.floor(totalSecs / 86400);

    if (secs !== prevSecs) {
      daysEl.textContent    = days.toLocaleString();
      hoursEl.textContent   = pad(hours);
      minutesEl.textContent = pad(mins);
      secondsEl.textContent = pad(secs);

      // Subtle flip animation on the seconds digit
      secondsEl.style.animation = 'none';
      secondsEl.offsetHeight; // reflow
      secondsEl.style.animation = 'countFlip 0.3s ease';

      prevSecs = secs;
    }
  };

  update();
  setInterval(update, 500);
}

/* ─────────────────────────────────────────────────────────────
   9. FLOATING HEARTS CANVAS
───────────────────────────────────────────────────────────── */
function initHeartsCanvas() {
  const canvas = $('#hearts-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let hearts = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Heart shape path
  function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.bezierCurveTo( size * 0.6, -size * 0.9,  size * 1.1, size * 0.1,  0,  size * 0.7);
    ctx.bezierCurveTo(-size * 1.1, size * 0.1, -size * 0.6, -size * 0.9,  0, -size * 0.3);
    ctx.closePath();
    ctx.restore();
  }

  const colors = [
    'rgba(249,208,216,',
    'rgba(244,175,192,',
    'rgba(232,132,154,',
    'rgba(201,100,124,',
    'rgba(255,220,230,',
  ];

  function createHeart() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: 4 + Math.random() * 12,
      speed: 0.4 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.5,
      opacity: 0.15 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  // Seed initial hearts
  for (let i = 0; i < CONFIG.maxHearts; i++) {
    const h = createHeart();
    h.y = Math.random() * canvas.height; // spread vertically on init
    hearts.push(h);
  }

  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts = hearts.filter((h) => h.y > -30);

    while (hearts.length < CONFIG.maxHearts) {
      hearts.push(createHeart());
    }

    hearts.forEach((h) => {
      h.y       -= h.speed;
      h.wobble  += h.wobbleSpeed;
      h.x       += h.drift + Math.sin(h.wobble) * 0.4;

      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle   = h.color + h.opacity + ')';
      drawHeart(ctx, h.x, h.y, h.size);
      ctx.fill();
      ctx.restore();
    });
  }

  animate();
}

/* ─────────────────────────────────────────────────────────────
   10. MUSIC PLAYER
───────────────────────────────────────────────────────────── */
function initMusicPlayer() {
  const audio  = $('#bg-music');
  const btn    = $('#music-toggle');
  const icon   = $('#music-icon');
  const volume = $('#volume-slider');
  if (!audio || !btn) return;

  // Set initial volume from slider
  audio.volume = parseFloat(volume.value);

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        icon.textContent = '▐▐';
        btn.setAttribute('aria-label', 'Pause background music');
      }).catch(() => {
        // Autoplay blocked — user needs to interact first
        console.info('Music autoplay blocked by browser. User must interact.');
      });
    } else {
      audio.pause();
      icon.textContent = '▶';
      btn.setAttribute('aria-label', 'Play background music');
    }
  });

  volume.addEventListener('input', () => {
    audio.volume = parseFloat(volume.value);
  });
}

/* ─────────────────────────────────────────────────────────────
   11. THEME TOGGLE (DARK / LIGHT MODE)
───────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const btn  = $('#theme-toggle');
  const icon = $('#theme-icon');
  if (!btn) return;

  // Restore from localStorage
  const saved = localStorage.getItem('anniversary-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    icon.textContent = '☀';
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    icon.textContent = isDark ? '☀' : '🌙';
    localStorage.setItem('anniversary-theme', isDark ? 'dark' : 'light');
  });
}

/* ─────────────────────────────────────────────────────────────
   12. PHOTO GALLERY LIGHTBOX
───────────────────────────────────────────────────────────── */
function initLightbox() {
  const lightbox     = $('#lightbox');
  const lightboxImg  = $('#lightbox-img');
  const lightboxCap  = $('#lightbox-caption');
  const closeBtn     = $('.lightbox-close', lightbox);
  const prevBtn      = $('.lightbox-prev', lightbox);
  const nextBtn      = $('.lightbox-next', lightbox);
  const items        = $$('.gallery-item');
  if (!lightbox || !items.length) return;

  let currentIndex = 0;

  const open = (index) => {
    currentIndex = index;
    const item = items[index];
    const img  = $('img', item);
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    // Return focus to the triggering element
    items[currentIndex]?.focus();
  };

  const showPrev = () => open((currentIndex - 1 + items.length) % items.length);
  const showNext = () => open((currentIndex + 1) % items.length);

  items.forEach((item, i) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View photo ${i + 1}`);
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);

  // Keyboard navigation
  lightbox.setAttribute('tabindex', '-1');
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? showNext() : showPrev(); }
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   13. SURPRISE BUTTON
───────────────────────────────────────────────────────────── */
function initSurprise() {
  const btn    = $('#surprise-btn');
  const pre    = $('#surprise-pre');
  const reveal = $('#surprise-reveal');
  if (!btn || !reveal) return;

  btn.addEventListener('click', () => {
    pre.style.opacity    = '0';
    pre.style.transform  = 'scale(0.9)';
    pre.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      pre.hidden    = true;
      reveal.hidden = false;
    }, 400);

    if (CONFIG.enableConfetti) {
      setTimeout(launchConfetti, 200);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   14. BACK TO TOP BUTTON
───────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────────
   15. CONFETTI
───────────────────────────────────────────────────────────── */
function launchConfetti() {
  const canvas = $('#confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const palette = [
    '#f9d0d8', '#f4afc0', '#e8849a', '#c9647c',
    '#fce4ec', '#ff80ab', '#ffffff', '#c9a96e',
  ];

  for (let i = 0; i < CONFIG.confettiCount; i++) {
    particles.push({
      x:       Math.random() * canvas.width,
      y:       -20 - Math.random() * 100,
      vx:      (Math.random() - 0.5) * 4,
      vy:      2 + Math.random() * 4,
      size:    4 + Math.random() * 8,
      color:   palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      shape:   Math.random() > 0.4 ? 'rect' : 'circle',
      alpha:   1,
    });
  }

  let frame;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      if (p.y > canvas.height + 30) { p.alpha = 0; return; }
      alive = true;
      p.x        += p.vx;
      p.y        += p.vy;
      p.vy       += 0.08; // gravity
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height * 0.7) p.alpha -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });

    if (alive) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  cancelAnimationFrame(frame);
  draw();
}

/* ─────────────────────────────────────────────────────────────
   16. EASTER EGG
   Type the word "forever" anywhere on the page to reveal
───────────────────────────────────────────────────────────── */
function initEasterEgg() {
  const el = $('#easter-egg');
  if (!el) return;

  const secret  = 'forever';
  let   buffer  = '';
  let   timeout;

  document.addEventListener('keydown', (e) => {
    // Only capture printable single characters
    if (e.key.length !== 1) return;
    buffer += e.key.toLowerCase();

    // Keep buffer trimmed
    if (buffer.length > secret.length) {
      buffer = buffer.slice(-secret.length);
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => { buffer = ''; }, 3000);

    if (buffer === secret) {
      buffer = '';
      el.hidden = false;
      if (CONFIG.enableConfetti) launchConfetti();
      setTimeout(() => { el.hidden = true; }, 5000);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   17. PARALLAX — HERO SHAPES
───────────────────────────────────────────────────────────── */
function initParallax() {
  const shapes = $$('.hero-bg-shapes .shape');
  if (!shapes.length) return;

  // Only apply if user hasn't requested reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const factors = [0.08, 0.05, 0.12];

  const onScroll = () => {
    const scrollY = window.scrollY;
    shapes.forEach((el, i) => {
      el.style.transform = `translateY(${scrollY * factors[i]}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   18. SMOOTH TRANSITIONS BETWEEN SECTIONS
   Adds a subtle fade when navigating via anchor links
───────────────────────────────────────────────────────────── */
function initSmoothNavTransitions() {
  const navLinks = $$('#main-nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   INIT — Run everything when DOM is ready
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initScrollProgress();
  initNavActiveState();
  initRevealOnScroll();
  initHeroDays();
  initCountdown();
  initHeartsCanvas();
  initMusicPlayer();
  initThemeToggle();
  initLightbox();
  initSurprise();
  initBackToTop();
  initEasterEgg();
  initParallax();
  initSmoothNavTransitions();
});
