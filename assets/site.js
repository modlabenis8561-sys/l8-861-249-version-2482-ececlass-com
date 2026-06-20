(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (!toggle || !mobileNav) {
      return;
    }
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var carousel = document.querySelector(".hero-carousel");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
    var prev = carousel.querySelector(".hero-prev");
    var next = carousel.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        play();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        play();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        play();
      });
    }
    show(0);
    play();
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    inputs.forEach(function (input) {
      var scopeSelector = input.getAttribute("data-filter-input");
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      if (!scope) {
        scope = document;
      }
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-text") || card.textContent || "").toLowerCase();
          card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
        });
      });
    });
  }

  window.initPlayer = function (source) {
    var video = document.querySelector(".js-player");
    var cover = document.querySelector(".js-player-cover");
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".js-play"));
    var loaded = false;
    var hls = null;

    function loadAndPlay() {
      if (!video) {
        return;
      }
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 40
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", loadAndPlay);
    });
    if (cover) {
      cover.addEventListener("click", loadAndPlay);
    }
  };

  ready(function () {
    setupNavigation();
    setupHero();
    setupFilters();
  });
})();
