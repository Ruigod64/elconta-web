/**
 * scrollspy.js
 * Resalta el enlace del nav correspondiente a la sección visible.
 * El Conta Pizzas
 */

(function () {
  'use strict';

  /* IDs de secciones a observar */
  var sectionIds = ['inicio', 'nosotros', 'proceso', 'menu', 'resenas', 'contacto'];

  /* Recolectar secciones y links */
  var sections = [];
  var navLinks = [];

  sectionIds.forEach(function (id) {
    var section = document.getElementById(id);
    if (!section) return;

    /* Links tanto en nav desktop como mobile */
    var links = document.querySelectorAll('a[href="#' + id + '"]');
    sections.push(section);
    navLinks.push({ section: section, links: links });
  });

  if (sections.length === 0) return;

  /* Activar link correspondiente */
  function setActive(id) {
    navLinks.forEach(function (item) {
      var isActive = item.section.id === id;
      item.links.forEach(function (link) {
        link.classList.toggle('nav__link--active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    });
  }

  /* IntersectionObserver — más eficiente que scroll listener */
  if ('IntersectionObserver' in window) {
    var activeId   = '';
    var visibleMap = {};

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visibleMap[entry.target.id] = entry.intersectionRatio;
      });

      /* Encontrar la sección con mayor ratio visible */
      var maxRatio = 0;
      var newActive = activeId;

      sectionIds.forEach(function (id) {
        var ratio = visibleMap[id] || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          newActive = id;
        }
      });

      if (newActive && newActive !== activeId) {
        activeId = newActive;
        setActive(activeId);
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5],
      rootMargin: '-64px 0px -30% 0px'
    });

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });

  } else {
    /* Fallback scroll para navegadores sin IntersectionObserver */
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var scrollY  = window.pageYOffset;
        var closest  = null;
        var minDist  = Infinity;

        sections.forEach(function (section) {
          var top  = section.getBoundingClientRect().top + scrollY - 80;
          var dist = Math.abs(scrollY - top);
          if (scrollY >= top - 100 && dist < minDist) {
            minDist = dist;
            closest = section.id;
          }
        });

        if (closest) setActive(closest);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

})();
