/**
 * preloader.js
 * Preloader animado con barra de progreso — El Conta Pizzas
 * Se ejecuta primero (no-defer) para mostrar la pantalla de carga.
 */

(function () {
  'use strict';

  var preloader = document.getElementById('preloader');
  var bar       = document.getElementById('preloader-bar');
  if (!preloader) return;

  var progress  = 0;
  var interval  = null;

  /* Simular progreso suave mientras carga */
  function simulateProgress() {
    interval = setInterval(function () {
      if (progress < 85) {
        progress += Math.random() * 12 + 3;
        if (progress > 85) progress = 85;
        if (bar) bar.style.width = Math.min(progress, 100) + '%';
      }
    }, 120);
  }

  /* Completar y ocultar */
  function completeAndHide() {
    clearInterval(interval);
    progress = 100;
    if (bar) bar.style.width = '100%';

    setTimeout(function () {
      preloader.classList.add('hidden');
      /* Habilitar scroll una vez terminado */
      document.body.style.overflow = '';
      /* Disparar evento custom por si algún módulo necesita saberlo */
      var ev = new CustomEvent ? new CustomEvent('preloader:done') : document.createEvent('CustomEvent');
      if (ev.initCustomEvent) ev.initCustomEvent('preloader:done', true, false, null);
      document.dispatchEvent(ev);
    }, 300);
  }

  /* Bloquear scroll mientras carga */
  document.body.style.overflow = 'hidden';

  simulateProgress();

  /* Escuchar el evento load de la página */
  if (document.readyState === 'complete') {
    completeAndHide();
  } else {
    window.addEventListener('load', completeAndHide);
    /* Timeout de seguridad: máximo 4s de espera */
    setTimeout(completeAndHide, 4000);
  }

})();
