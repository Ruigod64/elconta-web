/**
 * toast.js
 * Sistema de notificaciones tipo toast — El Conta Pizzas
 * Expone window.showToast(message, duration, icon)
 */

(function () {
  'use strict';

  /* Crear el contenedor si no existe */
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');
    document.body.appendChild(container);
  }

  /**
   * Muestra un toast.
   * @param {string} message  — texto a mostrar
   * @param {number} duration — ms visibles (default 2800)
   * @param {string} icon     — emoji/icono prefix (optional)
   */
  function showToast(message, duration, icon) {
    duration = duration || 2800;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');

    if (icon) {
      var iconEl = document.createElement('span');
      iconEl.className = 'toast__icon';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.textContent = icon;
      toast.appendChild(iconEl);
    }

    var textEl = document.createElement('span');
    textEl.textContent = message;
    toast.appendChild(textEl);

    container.appendChild(toast);

    /* Auto-remove */
    var removeTimer = setTimeout(function () {
      removeToast(toast);
    }, duration);

    /* Click para cerrar antes */
    toast.addEventListener('click', function () {
      clearTimeout(removeTimer);
      removeToast(toast);
    });
  }

  function removeToast(toast) {
    toast.classList.add('toast--exit');
    toast.addEventListener('animationend', function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, { once: true });
  }

  /* Exponer globalmente */
  window.showToast = showToast;

  /* ---- Toasts automáticos en acciones clave ---- */
  document.addEventListener('DOMContentLoaded', function () {

    /* Copiar teléfono al hacer click en el número */
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          /* Solo mostrar toast; la llamada se maneja nativamente */
          showToast('Marcando número…', 2000, '📞');
        }
      });
    });

    /* Toast al hacer click en botón WA */
    var waLinks = document.querySelectorAll('a[href^="https://wa.me"]');
    waLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        showToast('Abriendo WhatsApp…', 2000, '💬');
      });
    });

    /* Toast al hacer click en redes sociales */
    var socialLinks = document.querySelectorAll('.social-btn, .footer__social-icon');
    socialLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        showToast('Visitando nuestra página…', 1800, '🚀');
      });
    });

  });

})();
