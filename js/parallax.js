/**
 * parallax.js
 * Efecto parallax para el hero — El Conta Pizzas
 * Desactivado en móvil/touch para performance y UX correcta
 */

(function () {
  'use strict';

  var bg = document.querySelector('.hero__parallax-bg');
  if (!bg) return;

  var ticking = false;

  // Detectar touch device
  var isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );

  // Detectar preferencia de movimiento reducido
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En móvil/touch: resetear inset para que el fondo llene bien el hero
  if (isTouchDevice || window.innerWidth <= 900) {
    bg.style.inset = '0';
    bg.style.transform = 'none';
    return;
  }

  function updateParallax() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var translateY = scrollY * 0.45;
    bg.style.transform = 'translateY(' + translateY + 'px)';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Recalcular al cambiar orientación
  window.addEventListener('orientationchange', function () {
    setTimeout(function () {
      if (window.innerWidth <= 900) {
        window.removeEventListener('scroll', onScroll);
        bg.style.inset = '0';
        bg.style.transform = 'none';
      }
    }, 200);
  });

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

})();
