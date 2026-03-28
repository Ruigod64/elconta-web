/**
 * browser-support.js
 * Detección de características y polyfills para navegadores antiguos
 * El Conta Pizzas — Legacy Support Module
 */

(function () {
  'use strict';

  /* ---- Feature Detection ---- */
  var features = {
    intersectionObserver: 'IntersectionObserver' in window,
    mutationObserver:     'MutationObserver' in window,
    customProperties:     window.CSS && CSS.supports && CSS.supports('color', 'var(--c)'),
    grid:                 window.CSS && CSS.supports && CSS.supports('display', 'grid'),
    smoothScroll:         'scrollBehavior' in document.documentElement.style,
    cssAnimation:         typeof document.createElement('div').style.animation !== 'undefined',
    requestAnimFrame:     'requestAnimationFrame' in window,
    classList:            'classList' in document.createElement('div'),
  };

  /* ---- Añadir clase no-js al body antes de JS load ---- */
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /* ---- requestAnimationFrame polyfill ---- */
  if (!features.requestAnimFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    window.cancelAnimationFrame = function (id) { clearTimeout(id); };
  }

  /* ---- classList polyfill básico para IE9 ---- */
  if (!features.classList) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function () {
        var self = this;
        function update(fn) {
          return function (value) {
            var classes = self.className.split(/\s+/);
            var index = classes.indexOf(value);
            fn(classes, index, value);
            self.className = classes.join(' ');
          };
        }
        return {
          add: update(function (classes, index, value) {
            if (!~index) classes.push(value);
          }),
          remove: update(function (classes, index) {
            if (~index) classes.splice(index, 1);
          }),
          toggle: update(function (classes, index, value) {
            if (~index) classes.splice(index, 1);
            else classes.push(value);
          }),
          contains: function (value) {
            return !!~self.className.split(/\s+/).indexOf(value);
          }
        };
      }
    });
  }

  /* ---- Smooth scroll polyfill para navegadores sin soporte nativo ---- */
  if (!features.smoothScroll) {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var start = window.pageYOffset;
        var end = target.getBoundingClientRect().top + window.pageYOffset - 80;
        var duration = 600;
        var startTime = null;

        function easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          window.scrollTo(0, start + (end - start) * easeInOutCubic(progress));
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }

  /* ---- IntersectionObserver polyfill ligero (reveal) ---- */
  if (!features.intersectionObserver) {
    // Fallback: mostrar todos los elementos reveal inmediatamente
    var revealEls = document.querySelectorAll('.reveal');
    for (var j = 0; j < revealEls.length; j++) {
      revealEls[j].classList.add('visible');
    }
  }

  /* ---- CSS Custom Properties: desactivar cursor personalizado si no hay soporte ---- */
  if (!features.customProperties) {
    var cursorGlow = document.getElementById('cursor-glow');
    var cursorDot  = document.getElementById('cursor-dot');
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (cursorDot)  cursorDot.style.display  = 'none';
    document.body.style.cursor = 'auto';
  }

  /* ---- CSS Grid: avisar si no hay soporte y aplicar flex ---- */
  if (!features.grid) {
    document.documentElement.classList.add('no-grid');
  }

  /* ---- Exposición del objeto features para uso en otros módulos ---- */
  window.ElContaSupport = features;

})();
