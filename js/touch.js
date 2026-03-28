/**
 * touch.js
 * Gestos táctiles para el menú de pestañas en móvil
 * y mejoras de UX táctil generales — El Conta Pizzas
 */

(function () {
  'use strict';

  /* ---- Swipe en las pestañas del menú ---- */
  var menuSection = document.querySelector('.menu');
  if (!menuSection) return;

  var tabs   = Array.prototype.slice.call(document.querySelectorAll('.menu__tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.menu__panel'));

  if (tabs.length === 0 || panels.length === 0) return;

  /* Estado activo compartido con menu.js (leemos la clase .active) */
  function getActiveIndex() {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].classList.contains('active')) return i;
    }
    return 0;
  }

  function activateTab(index) {
    var clamped = Math.max(0, Math.min(index, tabs.length - 1));
    tabs.forEach(function (t, i) {
      t.classList.toggle('active', i === clamped);
      t.setAttribute('aria-selected', i === clamped ? 'true' : 'false');
    });
    panels.forEach(function (p, i) {
      p.classList.toggle('active', i === clamped);
      p.hidden = i !== clamped;
    });

    /* Scroll la pestaña activa a la vista en móvil */
    var activeTab = tabs[clamped];
    if (activeTab && activeTab.scrollIntoView) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  /* Solo en pantallas táctiles */
  var isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );

  if (!isTouchDevice) return;

  /* Touch state */
  var startX    = 0;
  var startY    = 0;
  var isDragging = false;
  var THRESHOLD  = 55; /* px mínimos para considerar un swipe */
  var ANGLE_MAX  = 35; /* grados máximos de ángulo para ser horizontal */

  function onTouchStart(e) {
    var t = e.touches[0];
    startX     = t.clientX;
    startY     = t.clientY;
    isDragging = false;
  }

  function onTouchMove(e) {
    var t    = e.touches[0];
    var dx   = t.clientX - startX;
    var dy   = t.clientY - startY;
    var angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);

    /* Si el movimiento es predominantemente horizontal, prevenir scroll */
    if (Math.abs(dx) > 10 && (angle < ANGLE_MAX || angle > (180 - ANGLE_MAX))) {
      isDragging = true;
    }
  }

  function onTouchEnd(e) {
    if (!isDragging) return;

    var t   = e.changedTouches[0];
    var dx  = t.clientX - startX;
    var dy  = t.clientY - startY;
    var abs = Math.abs(dx);

    /* Verificar que sea suficientemente horizontal */
    var angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
    var isHorizontal = angle < ANGLE_MAX || angle > (180 - ANGLE_MAX);

    if (abs < THRESHOLD || !isHorizontal) return;

    var current = getActiveIndex();

    if (dx < 0) {
      /* Swipe izquierda → siguiente tab */
      window.ElContaMenu && window.ElContaMenu.activateTab(current + 1);
    } else {
      /* Swipe derecha → pestaña anterior */
      window.ElContaMenu && window.ElContaMenu.activateTab(current - 1);
    }
  }

  /* Aplicar listeners al área del menú */
  menuSection.addEventListener('touchstart', onTouchStart, { passive: true });
  menuSection.addEventListener('touchmove',  onTouchMove,  { passive: true });
  menuSection.addEventListener('touchend',   onTouchEnd,   { passive: true });

  /* ---- Indicador visual de swipe (solo primera visita) ---- */
  var HINT_KEY = 'elconta_swipe_hint_shown';
  var hintShown = false;

  try { hintShown = !!sessionStorage.getItem(HINT_KEY); } catch (e) {}

  if (!hintShown) {
    var hintTimer = setTimeout(function () {
      if (typeof window.showToast === 'function') {
        window.showToast('👆 Desliza el menú para ver más categorías', 3500);
      }
      try { sessionStorage.setItem(HINT_KEY, '1'); } catch (e) {}
    }, 2500);

    /* Cancelar si el usuario ya interactuó con las tabs */
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        clearTimeout(hintTimer);
        try { sessionStorage.setItem(HINT_KEY, '1'); } catch (e) {}
      }, { once: true });
    });
  }

  /* ---- Prevenir que el header del swipe regrese al body === */
  var tabsRow = document.querySelector('.menu__tabs');
  if (tabsRow) {
    tabsRow.addEventListener('touchstart', function (e) {
      e.stopPropagation();
    }, { passive: true });
  }

})();
