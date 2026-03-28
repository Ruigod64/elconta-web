/**
 * menu.js
 * Tabs del menú con dots de posición y soporte de teclado.
 * El Conta Pizzas
 */

(function () {
  'use strict';

  var tabs   = Array.prototype.slice.call(document.querySelectorAll('.menu__tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.menu__panel'));
  var dots   = Array.prototype.slice.call(document.querySelectorAll('.menu__tab-dot'));
  var hint   = document.getElementById('swipe-hint');

  if (tabs.length === 0) return;

  /* ---- Activar una pestaña por índice ---- */
  function activateTab(index) {
    var i = ((index % tabs.length) + tabs.length) % tabs.length; // clamp cíclico

    tabs.forEach(function (t, n) {
      var active = n === i;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    panels.forEach(function (p, n) {
      var active = n === i;
      p.classList.toggle('active', active);
      p.hidden = !active;
    });

    /* Sync dots */
    dots.forEach(function (d, n) {
      d.classList.toggle('active', n === i);
    });

    /* Scroll la pestaña activa al centro en móvil */
    var activeTab = tabs[i];
    if (activeTab && activeTab.scrollIntoView) {
      try {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (e) {}
    }
  }

  /* ---- Click ---- */
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      activateTab(i);
      hideHint();
    });

    /* Teclado: flechas izq/der entre tabs */
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        var next = (i + 1) % tabs.length;
        activateTab(next);
        tabs[next].focus();
      }
      if (e.key === 'ArrowLeft') {
        var prev = (i - 1 + tabs.length) % tabs.length;
        activateTab(prev);
        tabs[prev].focus();
      }
      if (e.key === 'Home') { activateTab(0); tabs[0].focus(); }
      if (e.key === 'End')  { activateTab(tabs.length - 1); tabs[tabs.length - 1].focus(); }
    });
  });

  /* ---- Click en dots ---- */
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { activateTab(i); });
  });

  /* ---- Ocultar hint tras primera interacción ---- */
  function hideHint() {
    if (hint) hint.classList.add('hidden');
  }

  /* Auto-ocultar hint después de 5 s */
  if (hint) {
    setTimeout(hideHint, 5000);
  }

  /* ---- Exponer para touch.js ---- */
  window.ElContaMenu = { activateTab: activateTab };

  /* ---- Activar primera tab al inicio ---- */
  activateTab(0);

})();
