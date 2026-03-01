document.addEventListener('DOMContentLoaded', function () {
  var nav = document.getElementById('nav') || document.querySelector('nav');
  var toggle = document.getElementById('nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  var links = document.getElementById('nav-links');
  if (links) {
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation');
        }
      });
    });
  } else {
    // close nav when other nav items are clicked (buttons/links)
    nav.querySelectorAll('a,button').forEach(function (el) {
      if (el === toggle) return;
      el.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open navigation');
        }
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }
  });
});