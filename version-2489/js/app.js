(function () {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function setHeaderShadow() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', setHeaderShadow, { passive: true });
  setHeaderShadow();

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function normalizeText(value) {
    return (value || '').toString().toLowerCase().replace(/\s+/g, '');
  }

  function setupFilters() {
    var list = document.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }

    var input = document.querySelector('[data-filter-input]');
    var year = document.querySelector('[data-filter-year]');
    var region = document.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (input && q) {
      input.value = q;
    }

    function applyFilter() {
      var keyword = normalizeText(input ? input.value : '');
      var y = year ? year.value : '';
      var r = region ? region.value : '';

      cards.forEach(function (card) {
        var haystack = normalizeText([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' '));
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var okYear = !y || cardYear === y;
        var okRegion = !r || cardRegion.indexOf(r) !== -1;
        card.classList.toggle('hidden', !(okKeyword && okYear && okRegion));
      });
    }

    [input, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  setupFilters();

  function setupPlayer() {
    var video = document.querySelector('[data-player]');
    if (!video) {
      return;
    }

    var playUrl = video.getAttribute('data-play-url');
    var playButton = document.querySelector('[data-play-button]');

    if (playUrl) {
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
      } else {
        video.src = playUrl;
      }
    }

    function startVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function toggleVideo() {
      if (video.paused) {
        startVideo();
      } else {
        video.pause();
      }
    }

    if (playButton) {
      playButton.addEventListener('click', startVideo);
    }

    video.addEventListener('click', toggleVideo);
    video.addEventListener('play', function () {
      if (playButton) {
        playButton.classList.add('hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (playButton) {
        playButton.classList.remove('hidden');
      }
    });
  }

  setupPlayer();
})();
