/* ================================================================
   SCRIPTA ACADEMIC — Scripts
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Initialize Lucide Icons
     ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) {
      lucide.createIcons();
    }
  });

  /* ----------------------------------------------------------------
     Navbar — solid on scroll
     ---------------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var SCROLL_THRESHOLD = 60;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--solid');
    } else {
      navbar.classList.remove('navbar--solid');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ----------------------------------------------------------------
     Mobile menu toggle
     ---------------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('navbar__menu--open');
    toggle.classList.toggle('navbar__toggle--active');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Close mobile menu on link click
  var menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('navbar__menu--open');
      toggle.classList.remove('navbar__toggle--active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* ----------------------------------------------------------------
     Smooth scroll for internal links (fallback for Safari)
     ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = navbar.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------------
     Scroll Reveal — Intersection Observer
     ---------------------------------------------------------------- */
  var revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ----------------------------------------------------------------
     Parallax — subtle hero pattern shift
     ---------------------------------------------------------------- */
  var heroPattern = document.querySelector('.hero__pattern');

  if (heroPattern && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroPattern.style.transform = 'translateY(' + scrolled * 0.3 + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------------
     Animated Counters
     ---------------------------------------------------------------- */
  var statsSection = document.getElementById('statsSection');

  if (statsSection && 'IntersectionObserver' in window) {
    var countersAnimated = false;

    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            var counters = statsSection.querySelectorAll('.stats__number');
            counters.forEach(function (counter) {
              var target = parseInt(counter.getAttribute('data-target'), 10);
              var duration = 1500;
              var start = 0;
              var startTime = null;

              function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                } else {
                  counter.textContent = target;
                }
              }

              window.requestAnimationFrame(step);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsSection);
  }

  /* ----------------------------------------------------------------
     Active nav link highlight on scroll
     ---------------------------------------------------------------- */
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.navbar__link[href="#' + id + '"]');

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--text-light)';
          link.style.opacity = '1';
        } else {
          link.style.color = '';
          link.style.opacity = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
