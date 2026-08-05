/* ================================================================
   THE ALBION ACADEMY — SCRIPT.JS
   Rebuilt from real source (Home.html)

   1. Sticky header — shrink + shadow on scroll
   2. Hamburger / mobile nav toggle
   3. Hero photo slider — arrows, dots, auto-advance, swipe, keyboard
   4. Testimonials slider — prev/next, dots, auto-advance
   5. Scroll reveal — services, find-out items
================================================================ */

document.addEventListener('DOMContentLoaded', () => {


  /* ============================================================
     1. STICKY HEADER — shrink on scroll
  ============================================================ */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  /* ============================================================
     2. HAMBURGER / MOBILE NAV TOGGLE
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });

    // Close when clicking outside the header
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });

    // Close when a nav link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }


  /* ============================================================
     3. HERO PHOTO SLIDER
     ─────────────────────────────────────────────────────────
     Reads ALL .hero-slide elements from index.html.

     HOW TO ADD/REMOVE SLIDES:
       Edit the <div class="hero-slide"> blocks in index.html.
       No JS changes needed — this script counts them automatically.

     Features:
       · Prev / Next arrow buttons
       · Horizontal dot indicators (bottom centre)
       · Auto-advances every 5 seconds
       · Pauses on mouse hover
       · Touch / swipe support (left = next, right = prev)
       · Left / Right keyboard arrows when slider is focused
  ============================================================ */
  const heroTrack = document.getElementById('heroTrack');
  const heroDots  = document.getElementById('heroDots');
  const heroPrev  = document.getElementById('heroPrev');
  const heroNext  = document.getElementById('heroNext');

  if (heroTrack && heroDots) {
    const slides = Array.from(heroTrack.querySelectorAll('.hero-slide'));
    const total  = slides.length;
    let   cur    = 0;
    let   timer  = null;

    /* ── Build one dot button per slide ── */
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className   = 'hdot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); resetTimer(); });
      heroDots.appendChild(btn);
    });

    function getDots() {
      return heroDots.querySelectorAll('.hdot');
    }

    /* ── Move to a specific slide index ── */
    function goTo(index) {
      cur = (index + total) % total;
      heroTrack.style.transform = `translateX(-${cur * 100}%)`;
      getDots().forEach((d, i) => {
        d.classList.toggle('active', i === cur);
        d.setAttribute('aria-current', i === cur ? 'true' : 'false');
      });
    }

    /* ── Prev / Next buttons ── */
    if (heroPrev) heroPrev.addEventListener('click', () => { goTo(cur - 1); resetTimer(); });
    if (heroNext) heroNext.addEventListener('click', () => { goTo(cur + 1); resetTimer(); });

    /* ── Auto-advance timer (5 seconds, matches real site) ── */
    function startTimer() { timer = setInterval(() => goTo(cur + 1), 5000); }
    function stopTimer()  { clearInterval(timer); }
    function resetTimer() { stopTimer(); startTimer(); }

    /* ── Pause on hover ── */
    const sliderEl = document.querySelector('.hero-right');
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', stopTimer);
      sliderEl.addEventListener('mouseleave', startTimer);
    }

    /* ── Touch / swipe support ──
         Swipe left  → next slide
         Swipe right → previous slide                           */
    let touchX = 0;
    heroTrack.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
    }, { passive: true });

    heroTrack.addEventListener('touchend', e => {
      const delta = touchX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 44) {
        goTo(delta > 0 ? cur + 1 : cur - 1);
        resetTimer();
      }
    });

    /* ── Keyboard navigation ── */
    heroTrack.setAttribute('tabindex', '0');
    heroTrack.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { goTo(cur + 1); resetTimer(); }
      if (e.key === 'ArrowLeft')  { goTo(cur - 1); resetTimer(); }
    });

    startTimer();
  }


  /* ============================================================
     4. TESTIMONIALS SLIDER
     ─────────────────────────────────────────────────────────
     Reads ALL .testi-slide elements from index.html.

     HOW TO ADD/REMOVE TESTIMONIALS:
       Edit the <div class="testi-slide"> blocks in index.html.
       No JS changes needed.

     Features:
       · Prev / Next arrow buttons
       · Dot indicators
       · Auto-advances every 8 seconds (matches real site)
       · Pauses on hover
       · Fade-in animation between slides
  ============================================================ */
  const testiTrack = document.getElementById('testiTrack');
  const testiDots  = document.getElementById('testiDots');
  const testiPrev  = document.getElementById('testiPrev');
  const testiNext  = document.getElementById('testiNext');

  if (testiTrack && testiDots) {
    const slides = Array.from(testiTrack.querySelectorAll('.testi-slide'));
    const total  = slides.length;
    let   cur    = 0;
    let   timer  = null;

    /* ── First slide already has .active in HTML ── */

    /* ── Build dots ── */
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className   = 'tdot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); resetTimer(); });
      testiDots.appendChild(btn);
    });

    function getDots() {
      return testiDots.querySelectorAll('.tdot');
    }

    /* ── Move to a specific testimonial ── */
    function goTo(index) {
      slides[cur].classList.remove('active');
      cur = (index + total) % total;
      slides[cur].classList.add('active');
      getDots().forEach((d, i) => {
        d.classList.toggle('active', i === cur);
        d.setAttribute('aria-current', i === cur ? 'true' : 'false');
      });
    }

    /* ── Arrows ── */
    if (testiPrev) testiPrev.addEventListener('click', () => { goTo(cur - 1); resetTimer(); });
    if (testiNext) testiNext.addEventListener('click', () => { goTo(cur + 1); resetTimer(); });

    /* ── Auto-advance (8 seconds — same as real site) ── */
    function startTimer() { timer = setInterval(() => goTo(cur + 1), 8000); }
    function stopTimer()  { clearInterval(timer); }
    function resetTimer() { stopTimer(); startTimer(); }

    /* ── Pause on hover ── */
    const testiSection = document.querySelector('.testi-section');
    if (testiSection) {
      testiSection.addEventListener('mouseenter', stopTimer);
      testiSection.addEventListener('mouseleave', startTimer);
    }

    startTimer();
  }


  /* ============================================================
     5. SCROLL REVEAL
     Service items and Find-Out items fade + slide up as they
     enter the viewport. Skipped if user prefers reduced motion.
  ============================================================ */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!REDUCED) {
    const revealEls = document.querySelectorAll(
      '.service-item, .fo-item, .fo-heading, .fo-sub'
    );

    revealEls.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition =
        `opacity .5s ease ${(i % 6) * 65}ms,
         transform .5s ease ${(i % 6) * 65}ms`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }


});
/* ── end script.js ── */
