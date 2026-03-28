/**
 * cursor.js
 * Cursor luminoso con delay — El Conta Pizzas
 */

(function () {
  'use strict';

  var glow = document.getElementById('cursor-glow');
  var dot  = document.getElementById('cursor-dot');

  if (!glow || !dot) return;

  // Posiciones del mouse y del glow
  var mouse = { x: -500, y: -500 };
  var glowPos = { x: -500, y: -500 };
  var dotPos  = { x: -500, y: -500 };

  // Velocidades de seguimiento (0-1: más bajo = más retraso)
  var GLOW_LERP = 0.06;
  var DOT_LERP  = 0.18;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function animate() {
    // Interpolar posición del glow (lento)
    glowPos.x = lerp(glowPos.x, mouse.x, GLOW_LERP);
    glowPos.y = lerp(glowPos.y, mouse.y, GLOW_LERP);

    // Interpolar posición del dot (un poco más rápido)
    dotPos.x = lerp(dotPos.x, mouse.x, DOT_LERP);
    dotPos.y = lerp(dotPos.y, mouse.y, DOT_LERP);

    glow.style.left = glowPos.x + 'px';
    glow.style.top  = glowPos.y + 'px';

    dot.style.left = dotPos.x + 'px';
    dot.style.top  = dotPos.y + 'px';

    requestAnimationFrame(animate);
  }

  // Efecto hover en elementos interactivos
  var interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label';

  function addHoverEffects() {
    var els = document.querySelectorAll(interactiveSelectors);
    els.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('hovering');
        glow.style.width  = '600px';
        glow.style.height = '600px';
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('hovering');
        glow.style.width  = '400px';
        glow.style.height = '400px';
      });
    });
  }

  // Ocultar cursor al salir de la ventana
  document.addEventListener('mouseleave', function () {
    glow.style.opacity = '0';
    dot.style.opacity  = '0';
  });

  document.addEventListener('mouseenter', function () {
    glow.style.opacity = '1';
    dot.style.opacity  = '1';
  });

  // Solo activar en dispositivos no táctiles
  var isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );

  if (!isTouchDevice) {
    document.addEventListener('mousemove', onMouseMove);
    animate();
    addHoverEffects();
  } else {
    // Dispositivos táctiles: ocultar cursor personalizado
    if (glow) glow.style.display = 'none';
    if (dot)  dot.style.display  = 'none';
    document.body.style.cursor = 'auto';
  }

})();
