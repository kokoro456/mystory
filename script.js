(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Cursor (skip if elements don't exist — e.g. glass/neumo pages have their own) =====
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx = 0, my = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  if (cursor && dot) {
    function tickCursor() {
      dx += (mx - dx) * 0.12;
      dy += (my - dy) * 0.12;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    const hoverSel = 'a, button, .j-card, .tennis-card, .phil-card, .c-card, .now-card, .badge, .pill, .char, .glass-card, .tilt-card, .contact-card, .deck-card, .bubble';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  // ===== Split Text =====
  document.querySelectorAll('[data-split]').forEach(el => {
    const raw = el.textContent;
    el.textContent = '';
    let idx = 0;
    [...raw].forEach(ch => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.innerHTML = ch === ' ' ? '&nbsp;' : ch;
      span.style.animationDelay = `${0.3 + idx * 0.03}s`;
      if (ch !== ' ') idx++;
      el.appendChild(span);
    });
  });

  // Rebind hover on chars (only if cursor exists)
  if (cursor) {
    document.querySelectorAll('.char').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  // ===== Scroll Reveal =====
  if (!reduced) {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));

    // Stagger (safe — querySelectorAll returns empty if not found)
    document.querySelectorAll('.j-item').forEach((c, i) => { c.style.transitionDelay = `${i * 0.1}s`; });
    document.querySelectorAll('.phil-card').forEach((c, i) => { c.style.transitionDelay = `${i * 0.08}s`; });
    // deck-card stagger removed — JS tilt handles animation
  } else {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('visible');
      el.classList.add('is-visible');
    });
  }

  // ===== Parallax on Statements =====
  if (!reduced) {
    const stRows = document.querySelectorAll('.st-row');
    const nameRows = document.querySelectorAll('.name-row');

    if (stRows.length || nameRows.length) {
      window.addEventListener('scroll', () => {
        const sy = window.scrollY;

        nameRows.forEach(row => {
          const speed = parseFloat(row.dataset.speed) || 1;
          row.style.transform = `translateX(${sy * (speed - 1) * 0.2}px)`;
        });

        stRows.forEach(row => {
          const rect = row.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const speed = parseFloat(row.dataset.speed) || 1;
            const offset = (rect.top - window.innerHeight / 2) * (speed - 1) * 0.1;
            row.style.transform = `translateX(${offset}px)`;
          }
        });
      }, { passive: true });
    }
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('.nav-links a, .glass-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const t = document.querySelector(href);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
