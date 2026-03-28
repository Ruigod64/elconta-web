/**
 * main.js
 * Orquestador principal — El Conta Pizzas
 * Nav · Reveal · GSAP (desktop) · Contador hero
 */

(function () {
  'use strict';

  var isMobile = window.innerWidth <= 768;

  /* ============================================
     NAV — scroll behavior
  ============================================ */
  var nav = document.querySelector('.nav');

  function onNavScroll() {
    if (nav) nav.classList.toggle('scrolled', window.pageYOffset > 60);
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  /* ---- Hamburger móvil ---- */
  var hamburger  = document.querySelector('.nav__hamburger');
  var mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      
      // Scroll automático al top cuando se abre el menú en mobile
      if (open && window.innerWidth <= 900) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
    
    // Cerrar menú cuando hace scroll
    var scrollTimeout;
    window.addEventListener('scroll', function () {
      if (mobileMenu.classList.contains('open')) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }, 100);
      }
    }, { passive: true });
  }

  /* ============================================
     BACK TO TOP
  ============================================ */
  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     INTERSECTION OBSERVER — reveal on scroll
  ============================================ */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: isMobile ? 0.08 : 0.12,
      rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     GSAP
  ============================================ */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    var d  = isMobile ? 0.08 : 0.3;

    tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7, delay: d })
      .to('.hero__title',   { opacity: 1, y: 0, duration: isMobile ? 0.6 : 0.9 }, '-=0.35')
      .to('.hero__subtitle',{ opacity: 1, y: 0, duration: 0.65 }, '-=0.45')
      .to('.hero__actions', { opacity: 1, y: 0, duration: 0.6  }, '-=0.4')
      .to('.hero__chef',    { opacity: 1, x: 0, duration: 0.9  }, '-=0.85')
      .to('.hero__scroll',  { opacity: 1, duration: 0.5         }, '-=0.2');

    if (!isMobile && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to('.hero__text', {
        y: -60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.utils.toArray('.menu__card').forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%' },
          opacity: 0, y: 28, duration: 0.55, delay: (i % 3) * 0.08, ease: 'power2.out'
        });
      });

      gsap.utils.toArray('.process__step').forEach(function (step, i) {
        gsap.from(step, {
          scrollTrigger: { trigger: step, start: 'top 84%' },
          opacity: 0, x: i % 2 === 0 ? -45 : 45, duration: 0.75, ease: 'power3.out'
        });
      });

      gsap.utils.toArray('.spec-card').forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 87%' },
          opacity: 0, scale: 0.93, y: 18, duration: 0.65, delay: i * 0.1, ease: 'power2.out'
        });
      });

      var ctaTitle = document.querySelector('.cta-banner__title');
      if (ctaTitle) {
        gsap.from(ctaTitle, {
          scrollTrigger: { trigger: ctaTitle, start: 'top 82%' },
          opacity: 0, y: 45, duration: 0.9, ease: 'power3.out'
        });
      }
    }
  }

  function cssHeroReveal() {
    if (typeof gsap !== 'undefined') return;
    var items = [
      { sel: '.hero__eyebrow', delay: 200  },
      { sel: '.hero__title',   delay: 400  },
      { sel: '.hero__subtitle',delay: 600  },
      { sel: '.hero__actions', delay: 800  },
      { sel: '.hero__chef',    delay: 500  },
      { sel: '.hero__scroll',  delay: 1000 }
    ];
    items.forEach(function (item) {
      var el = document.querySelector(item.sel);
      if (!el) return;
      setTimeout(function () {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translate(0,0)';
      }, item.delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }
  window.addEventListener('load', cssHeroReveal);

  /* ============================================
     CONTADOR animado — estadísticas hero
  ============================================ */
  function animateCounter(el, target, duration) {
    var startTime = null;
    var suffix    = el.dataset.suffix || '';
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.hero__stat-number').forEach(function (el) {
          var val = parseInt(el.dataset.value, 10);
          if (!isNaN(val)) animateCounter(el, val, 1100);
        });
        statsObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    var statsEl = document.querySelector('.hero__stats');
    if (statsEl) statsObs.observe(statsEl);
  }

})();
