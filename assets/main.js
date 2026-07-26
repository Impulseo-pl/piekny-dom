// Piękny Dom - interakcje strony (nagłówek, odsłanianie, liczniki, opinie, filtr realizacji)
(function () {
  var hdr = document.getElementById('hdr');
  var progress = document.getElementById('progress');

  var onScroll = function () {
    var y = window.scrollY;
    if (y > 20) hdr.classList.add('scrolled'); else hdr.classList.remove('scrolled');
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.style.transform = 'translateY(' + (r.top * -0.07) + 'px)';
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // menu mobilne
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    nav.classList.toggle('open');
    burger.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  // odsłanianie sekcji
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // liczniki
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (c) { cio.observe(c); });
  }

  // opinie - przewijanie
  var track = document.getElementById('opTrack');
  if (track) {
    var slides = track.querySelectorAll('.op');
    var dotsWrap = document.getElementById('opDots');
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Opinia ' + (i + 1));
      if (i === 0) b.classList.add('on');
      b.addEventListener('click', function () { go(i); reset(); });
      dotsWrap.appendChild(b);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function go(n) {
      slides[idx].classList.remove('is-active');
      dots[idx].classList.remove('on');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      dots[idx].classList.add('on');
    }
    function reset() {
      clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 6000);
    }
    reset();
  }

  // filtr realizacji
  var filter = document.getElementById('pfFilter');
  if (filter) {
    var items = document.querySelectorAll('#pfGrid .pf');
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      filter.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.getAttribute('data-f');
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-cat') === f;
        it.classList.toggle('hide', !show);
      });
    });
  }

  // podświetlenie aktywnej sekcji w menu
  var sections = ['top', 'onas', 'uslugi', 'proces', 'realizacje', 'kontakt'];
  var navLinks = nav.querySelectorAll('a');
  window.addEventListener('scroll', function () {
    var pos = window.scrollY + 140, cur = 'top';
    sections.forEach(function (id) {
      var s = document.getElementById(id);
      if (s && s.offsetTop <= pos) cur = id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });
})();
